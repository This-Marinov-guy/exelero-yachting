"use client";
import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Link from "next/link";
import styles from "../AdminShell.module.scss";
import Image from "next/image";
import { Eye, Edit, Trash2 } from "lucide-react";
import EditBoatModal from "./EditBoatModal";
import AccountSkeleton from "../AccountSkeleton";

type Boat = {
    id: string;
    slug: string | null;
    active: boolean;
    bought: boolean;
    boat_data: {
        title: string;
    } | null;
    broker_data: {
        name: string;
        dealer: string | null;
    } | null;
    main_image: string | null;
};

const BoatsListing = () => {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [loadFailed, setLoadFailed] = useState(false);
    const [limit, setLimit] = useState(25);
    const [loading, setLoading] = useState(true);
    const [boats, setBoats] = useState<Boat[]>([]);
    const [updatingActive, setUpdatingActive] = useState<Set<string>>(new Set());
    const [updatingBought, setUpdatingBought] = useState<Set<string>>(new Set());
    const [availabilityErrors, setAvailabilityErrors] = useState<Record<string, string>>({});
    const [deleting, setDeleting] = useState<Set<string>>(new Set());
    const [editBoatId, setEditBoatId] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const closeBoatEditor = useCallback(() => setEditBoatId(null), []);

    useEffect(() => {
        const fetchBoats = async () => {
            setLoading(true); setLoadFailed(false);
            const supabase = getSupabaseBrowserClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                setLoadFailed(true);
                setLoading(false);
                return;
            }

            try {
                // Fetch boats with boat_data
                const { data: boatsData, error: boatsError } = await supabase
                    .from("boats")
                    .select(`
            id,
            slug,
            active,
            bought,
            boat_data(title)
          `)
                    .order("created_at", { ascending: false });

                if (boatsError) {
                    console.error("Error fetching boats:", boatsError);
                    toast.error("Failed to load boats");
                    setLoadFailed(true);
                    return;
                }

                if (!boatsData) {
                    setBoats([]);
                    return;
                }

                // Fetch broker_data and main images for each boat
                const boatsWithDetails = await Promise.all(
                    boatsData.map(async (boat: any) => {
                        // Fetch broker_data
                        const { data: brokerData } = await supabase
                            .from("broker_data")
                            .select("name, dealer")
                            .eq("boat_id", boat.id)
                            .maybeSingle();

                        // Fetch main image
                        const { data: imagesData } = await supabase
                            .from("boat_images")
                            .select("link")
                            .eq("boat_id", boat.id)
                            .eq("media_type", "image")
                            .order("display_order", { ascending: true })
                            .limit(1)
                            .maybeSingle();

                        return {
                            ...boat,
                            broker_data: brokerData,
                            main_image: imagesData?.link || null,
                        };
                    })
                );

                setBoats(boatsWithDetails);
            } catch (error) {
                console.error("Error fetching boats:", error);
                toast.error("Failed to load boats");
                    setLoadFailed(true);
            } finally { setLoading(false); }
        };

        fetchBoats();
    }, [refreshTrigger]);

    useEffect(() => {
        const onRefresh = () => setRefreshTrigger((t) => t + 1);
        window.addEventListener("boatsListingRefresh", onRefresh);
        return () => window.removeEventListener("boatsListingRefresh", onRefresh);
    }, []);

    const handleToggleActive = async (boatId: string, currentActive: boolean) => {
        const boat = boats.find((item) => item.id === boatId);
        if (boat?.bought) {
            toast.error("Mark this yacht available before publishing it.");
            return;
        }

        setUpdatingActive((prev) => new Set(prev).add(boatId));

        const supabase = getSupabaseBrowserClient();

        try {
            const { error } = await supabase
                .from("boats")
                .update({ active: !currentActive })
                .eq("id", boatId).select("id").single();

            if (error) {
                console.error("Error updating boat active status:", error);
                toast.error("Could not update yacht visibility. Try again.");
            } else {
                setBoats((prev) =>
                    prev.map((boat) =>
                        boat.id === boatId ? { ...boat, active: !currentActive } : boat
                    )
                );
                toast.success(`Yacht ${!currentActive ? "published" : "hidden"}.`);
            }
        } catch (error) {
            console.error("Error toggling boat active status:", error);
            toast.error("Could not update yacht visibility. Try again.");
        } finally {
            setUpdatingActive((prev) => {
                const next = new Set(prev);
                next.delete(boatId);
                return next;
            });
        }
    };

    const handleToggleBought = async (boatId: string, currentBought: boolean) => {
        const nextBought = !currentBought;
        setAvailabilityErrors((prev) => { const next = { ...prev }; delete next[boatId]; return next; });
        setUpdatingBought((prev) => new Set(prev).add(boatId));

        const supabase = getSupabaseBrowserClient();

        try {
            const { error } = await supabase
                .from("boats")
                .update({ bought: nextBought, active: false })
                .eq("id", boatId).select("id").single();

            if (error) throw error;
            setBoats((prev) => prev.map((boat) => boat.id === boatId ? { ...boat, bought: nextBought, active: false } : boat));
            toast.success(nextBought ? "Yacht marked as sold and removed from brokerage." : "Yacht marked available. Publish it separately to show it in brokerage.");
        } catch (error) {
            console.error("Error updating yacht availability:", error);
            setAvailabilityErrors((prev) => ({ ...prev, [boatId]: `Could not mark this yacht as ${nextBought ? "sold" : "available"}. Try again.` }));
        } finally {
            setUpdatingBought((prev) => {
                const next = new Set(prev);
                next.delete(boatId);
                return next;
            });
        }
    };

    const handleDelete = async (boatId: string) => {
        if (!confirm("Are you sure you want to delete this boat? This action cannot be undone.")) {
            return;
        }

        setDeleting((prev) => new Set(prev).add(boatId));

        const supabase = getSupabaseBrowserClient();

        try {
            // Unlink dealer (broker_data) from this boat so the dealer is not deleted
            const { error: unlinkError } = await supabase.from("broker_data").update({ boat_id: null }).eq("boat_id", boatId);
            if (unlinkError) throw unlinkError;

            // Delete boat (cascade will handle boat_data, boat_images, inqueries, etc.)
            const { error } = await supabase.from("boats").delete().eq("id", boatId).select("id").single();

            if (error) {
                console.error("Error deleting boat:", error);
                toast.error("Failed to delete boat");
            } else {
                setBoats((prev) => prev.filter((boat) => boat.id !== boatId));
                toast.success("Boat deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting boat:", error);
            toast.error("Failed to delete boat");
        } finally {
            setDeleting((prev) => {
                const next = new Set(prev);
                next.delete(boatId);
                return next;
            });
        }
    };

    const handlePreview = (boat: Boat) => {
        const numericId = parseInt(boat.id.replace(/-/g, "").substring(0, 8), 16) % 10000000;
        window.open(`/services/brokerage/${boat.slug || numericId}`, "_blank", "noopener,noreferrer");
    };

    const handleEdit = (boatId: string) => {
        setEditBoatId(boatId);
    };

    const refreshBoats = async () => {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data: boatsData, error: boatsError } = await supabase
            .from("boats")
            .select(`id, slug, active, bought, boat_data(title)`)
            .order("created_at", { ascending: false });
        if (!boatsError && boatsData) {
            const boatsWithDetails = await Promise.all(
                boatsData.map(async (boat: any) => {
                    const { data: brokerData } = await supabase.from("broker_data").select("name, dealer").eq("boat_id", boat.id).maybeSingle();
                    const { data: imagesData } = await supabase.from("boat_images").select("link").eq("boat_id", boat.id).eq("media_type", "image").order("display_order", { ascending: true }).limit(1).maybeSingle();
                    return { ...boat, broker_data: brokerData, main_image: imagesData?.link || null };
                })
            );
            setBoats(boatsWithDetails);
        }
    };

    const handleEditSaved = () => {
        setEditBoatId(null);
        refreshBoats();
    };

    const visible = boats.filter(boat => (filter === "all" || (filter === "published" ? boat.active && !boat.bought : filter === "sold" ? boat.bought : !boat.active && !boat.bought)) && [boat.boat_data?.title, boat.broker_data?.dealer, boat.broker_data?.name].some(value => value?.toLowerCase().includes(query.toLowerCase())));
    return <>
      <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4"><h1 className="dashboard-title mb-0">Boat listings</h1><Link className="btn-solid" href="/account?tab=upload-boat">Add a boat</Link></div>
      <p className="admin-section-description">Manage all brokerage listings, visibility and availability.</p>
      {loading ? <AccountSkeleton kind="boats" heading={false} /> : loadFailed ? <div className="admin-empty"><p>The boat list is unavailable.</p><button type="button" className="btn-border" onClick={() => setRefreshTrigger(value => value + 1)}>Try again</button></div> : <>
        <div className="admin-toolbar"><label>Search boats<input type="search" value={query} placeholder="Boat title or dealer" onChange={event => { setQuery(event.target.value); setLimit(25); }} /></label><label>Status<select value={filter} onChange={event => { setFilter(event.target.value); setLimit(25); }}><option value="all">All boats ({boats.length})</option><option value="published">Published</option><option value="hidden">Hidden</option><option value="sold">Sold</option></select></label></div>
        {visible.length ? <><div className={styles.tableRegion} role="region" aria-label="Boat listings" tabIndex={0}><table><thead><tr><th scope="col">Boat</th><th scope="col">Dealer</th><th scope="col">Visibility</th><th scope="col">Availability</th><th scope="col">Actions</th></tr></thead><tbody>{visible.slice(0, limit).map(boat => {
          const busy = updatingActive.has(boat.id) || updatingBought.has(boat.id) || deleting.has(boat.id);
          const title = boat.boat_data?.title || "Untitled boat";
          return <tr key={boat.id}>
            <td><div className="d-flex align-items-center gap-3">{boat.main_image && <Image src={boat.main_image} alt="" width={88} height={60} style={{ objectFit: "cover", borderRadius: 4 }} />}<strong>{title}</strong></div></td>
            <td>{boat.broker_data?.dealer || "—"}<small>{boat.broker_data?.name}</small></td>
            <td><div className={styles.availabilityCell}>
              <span className={styles.visibilityBadge} data-published={boat.active && !boat.bought}>{boat.active && !boat.bought ? "Published" : "Hidden"}</span>
              {boat.bought ? <span className={styles.visibilityNote}>Mark available to publish</span> : <button type="button" className={`btn-border ${styles.availabilityAction}`} aria-label={`${boat.active ? "Hide" : "Publish"} ${title}`} disabled={busy} onClick={() => void handleToggleActive(boat.id, boat.active)}>{updatingActive.has(boat.id) ? "Saving…" : boat.active ? "Hide" : "Publish"}</button>}
            </div></td>
            <td><div className={styles.availabilityCell}>
              <span className={styles.availabilityBadge} data-sold={boat.bought}>{boat.bought ? "Sold" : "Available"}</span>
              <button type="button" className={`btn-border ${styles.availabilityAction}`} aria-label={`Mark ${title} as ${boat.bought ? "available" : "sold"}`} disabled={busy} onClick={() => { if (boat.bought || window.confirm(`Mark ${title} as sold? This will remove it from brokerage and stop new inquiries.`)) void handleToggleBought(boat.id, boat.bought); }}>{updatingBought.has(boat.id) ? "Saving…" : boat.bought ? "Mark available" : "Mark as sold"}</button>
              {availabilityErrors[boat.id] && <span className={styles.availabilityError} role="alert">{availabilityErrors[boat.id]}</span>}
            </div></td>
            <td><div className="d-flex gap-2">
              {boat.active && !boat.bought && <button type="button" className="profile-table-action-btn" aria-label={`View ${title}`} onClick={() => handlePreview(boat)}><Eye /></button>}
              <button type="button" className="profile-table-action-btn" aria-label={`Edit ${title}`} disabled={busy} onClick={() => handleEdit(boat.id)}><Edit /></button>
              <button type="button" className="profile-table-action-btn profile-table-action-btn-danger" aria-label={`Delete ${title}`} disabled={busy} onClick={() => void handleDelete(boat.id)}>{deleting.has(boat.id) ? "…" : <Trash2 />}</button>
            </div></td>
          </tr>;
        })}</tbody></table></div><div className={styles.listFooter}><span>Showing {Math.min(limit, visible.length)} of {visible.length} boats</span>{limit < visible.length && <button type="button" className="btn-border" onClick={() => setLimit(limit + 25)}>Show more</button>}</div></> : <div className="admin-empty"><h2>{boats.length ? "No matching boats" : "No boat listings yet"}</h2><p>{boats.length ? "Try another title or status." : "Create a listing or save a draft to finish later."}</p>{boats.length ? <button className="btn-border" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</button> : <Link href="/account?tab=upload-boat" className="btn-solid">Add a boat</Link>}</div>}
      </>}
      {editBoatId && <EditBoatModal boatId={editBoatId} isOpen={!!editBoatId} onClose={closeBoatEditor} onSaved={handleEditSaved} />}
    </>;
};
export default BoatsListing;
