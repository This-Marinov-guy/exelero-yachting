"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "reactstrap";
import { UploadedImage } from "@/redux/reducers/BoatUploadSlice";

interface BoatDraft {
    id: string;
    user_id: string;
    title: string | null;
    type: string | null;
    condition: string | null;
    manufacturer: string | null;
    build_number: string | null;
    build_year: string | null;
    location: string | null;
    price: number | null;
    vat_included: boolean;
    description: string | null;
    hull_length: number | null;
    waterline_length: number | null;
    beam: number | null;
    draft: number | null;
    ballast: number | null;
    displacement: number | null;
    engine_power: number | null;
    fuel_tank: number | null;
    water_tank: number | null;
    brochure: string | null;
    brochure_file_name: string | null;
    additional_details: string | null;
    dealer_id: string | null;
    upload_folder_name: string | null;
    images: UploadedImage[];
    main_image_index: number;
    created_at: string;
    updated_at: string;
}

const BoatDraftsList = () => {
    const [drafts, setDrafts] = useState<BoatDraft[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchDrafts = async () => {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data, error } = await supabase
            .from("boat_drafts")
            .select("*")
            .eq("user_id", session.user.id)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("Error fetching drafts:", error);
            return;
        }
        setDrafts(data || []);
    };

    useEffect(() => {
        fetchDrafts();

        const handleDraftSaved = () => fetchDrafts();
        window.addEventListener("draftSaved", handleDraftSaved);
        return () => window.removeEventListener("draftSaved", handleDraftSaved);
    }, []);

    const handleContinueEditing = (draft: BoatDraft) => {
        window.dispatchEvent(new CustomEvent("loadDraft", { detail: draft }));
        const section = document.getElementById("upload-boat-section");
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.from("boat_drafts").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete draft");
            setDeletingId(null);
            return;
        }
        setDrafts((prev) => prev.filter((d) => d.id !== id));
        setDeletingId(null);
        toast.success("Draft deleted");
    };

    if (drafts.length === 0) return null;

    return (
        <div className="boat-drafts-list mb-4">
            <h5 className="dashboard-title mb-3">Saved Drafts</h5>
            <div className="d-flex flex-column gap-2">
                {drafts.map((draft) => (
                    <div key={draft.id} className="draft-card d-flex align-items-center justify-content-between p-3 border rounded">
                        <div>
                            <span className="fw-semibold">
                                {draft.title || "Untitled Draft"}
                            </span>
                            <span className="text-muted ms-2" style={{ fontSize: "0.85rem" }}>
                                {new Date(draft.updated_at).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                type="button"
                                className="btn-solid btn-sm"
                                onClick={() => handleContinueEditing(draft)}
                                disabled={deletingId === draft.id}
                            >
                                Continue Editing
                            </Button>
                            <Button
                                type="button"
                                className="btn-outline btn-sm"
                                onClick={() => handleDelete(draft.id)}
                                disabled={deletingId === draft.id}
                            >
                                {deletingId === draft.id ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BoatDraftsList;
