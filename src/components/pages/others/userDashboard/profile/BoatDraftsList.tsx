"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "reactstrap";
import { UploadedBrochure, UploadedImage } from "@/redux/reducers/BoatUploadSlice";
import AccountSkeleton from "../AccountSkeleton";

interface BoatDraft {
    id: string;
    user_id: string;
    title: string | null;
    type: string | null;
    condition: string | null;
    keel_type: string | null;
    ce_design_category: string | null;
    material: string | null;
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
    brochures: UploadedBrochure[];
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
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);

    const fetchDrafts = async () => {
        setLoading(true);
        setLoadFailed(false);
        try {
            const supabase = getSupabaseBrowserClient();
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session?.user?.id) throw sessionError || new Error("Session unavailable");

            const { data, error } = await supabase
                .from("boat_drafts")
                .select("*")
                .eq("user_id", session.user.id)
                .order("updated_at", { ascending: false });

            if (error) throw error;
            setDrafts(data || []);
        } catch (error) {
            console.error("Error fetching drafts:", error);
            setLoadFailed(true);
        } finally {
            setLoading(false);
        }
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
        if (!window.confirm("Delete this saved draft? This cannot be undone.")) return;
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

    if (loading && drafts.length === 0) return <AccountSkeleton kind="drafts" />;
    if (loadFailed && drafts.length === 0) return <div className="admin-empty"><p>Saved drafts could not be loaded.</p><Button type="button" className="btn-border" onClick={() => void fetchDrafts()}>Try again</Button></div>;
    if (drafts.length === 0) return null;

    return (
        <div className="boat-drafts-list mb-4">
            <h2 className="mt-4 mb-3">Saved drafts</h2>
            {loadFailed && <div className="admin-empty mb-3"><p>Saved drafts could not be refreshed. Your current drafts are still shown.</p><Button type="button" className="btn-border" onClick={() => void fetchDrafts()}>Try again</Button></div>}
            <div className="d-flex flex-column gap-2">
                {drafts.map((draft) => (
                    <div key={draft.id} className="draft-card d-flex flex-wrap gap-3 align-items-center justify-content-between p-3 border rounded">
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
                                className="btn-border btn-sm"
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
                {loading && <AccountSkeleton kind="drafts" heading={false} rows={1} />}
            </div>
        </div>
    );
};

export default BoatDraftsList;
