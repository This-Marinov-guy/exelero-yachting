"use client";
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";

type Boat = {
    id: string;
    active: boolean;
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
    const [isLocked, setIsLocked] = useState(true);
    const [loading, setLoading] = useState(true);
    const [boats, setBoats] = useState<Boat[]>([]);
    const [updatingActive, setUpdatingActive] = useState<Set<string>>(new Set());
    const [deleting, setDeleting] = useState<Set<string>>(new Set());
    const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

    useEffect(() => {
        const checkDealerInfo = async () => {
            const supabase = getSupabaseBrowserClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                setIsLocked(true);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("broker_data")
                .select("id")
                .eq("user_id", session.user.id)
                .limit(1);

            setIsLocked(!data || data.length === 0);
            setLoading(false);
        };

        checkDealerInfo();

        // Listen for dealer data changes
        const handleDealerDataChanged = () => {
            checkDealerInfo();
        };

        window.addEventListener("dealerDataChanged", handleDealerDataChanged);

        return () => {
            window.removeEventListener("dealerDataChanged", handleDealerDataChanged);
        };
    }, []);

    useEffect(() => {
        if (isLocked || loading) return;

        const fetchBoats = async () => {
            const supabase = getSupabaseBrowserClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) return;

            try {
                // Fetch boats with boat_data
                const { data: boatsData, error: boatsError } = await supabase
                    .from("boats")
                    .select(`
            id,
            active,
            boat_data(title)
          `)
                    .eq("user_id", session.user.id)
                    .order("created_at", { ascending: false });

                if (boatsError) {
                    console.error("Error fetching boats:", boatsError);
                    toast.error("Failed to load boats");
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
                            .single();

                        // Fetch main image
                        const { data: imagesData } = await supabase
                            .from("boat_images")
                            .select("link")
                            .eq("boat_id", boat.id)
                            .order("display_order", { ascending: true })
                            .limit(1)
                            .single();

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
            }
        };

        fetchBoats();
    }, [isLocked, loading]);

    const handleToggleActive = async (boatId: string, currentActive: boolean) => {
        setUpdatingActive((prev) => new Set(prev).add(boatId));

        const supabase = getSupabaseBrowserClient();

        try {
            const { error } = await supabase
                .from("boats")
                .update({ active: !currentActive })
                .eq("id", boatId);

            if (error) {
                console.error("Error updating boat active status:", error);
                toast.error("Failed to update boat status");
            } else {
                setBoats((prev) =>
                    prev.map((boat) =>
                        boat.id === boatId ? { ...boat, active: !currentActive } : boat
                    )
                );
                toast.success(`Boat ${!currentActive ? "activated" : "hidden"}`);
            }
        } catch (error) {
            console.error("Error toggling boat active status:", error);
            toast.error("Failed to update boat status");
        } finally {
            setUpdatingActive((prev) => {
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
            // Delete boat (cascade will handle related records)
            const { error } = await supabase.from("boats").delete().eq("id", boatId);

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

    const handlePreview = (boatId: string) => {
        // TODO: Implement preview functionality
        toast.info("Preview functionality coming soon");
    };

    const handleEdit = (boatId: string) => {
        // TODO: Implement edit functionality
        toast.info("Edit functionality coming soon");
    };

    if (loading) {
        return (
            <div className="locked-section">
                <div className="locked-content">
                    <h4 className="dashboard-title">Boats Listing</h4>
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="locked-section">
                <div className="locked-content">
                    <h4 className="dashboard-title">Boats Listing</h4>
                    <p className="text-muted">This section is locked. Please save your dealer information first.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="boats-listing-section">
            <h4 className="dashboard-title mb-4">Boats Listing</h4>

            {boats.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <p className="text-muted text-lg">No boats found. Upload your first boat to get started.</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg border bg-card shadow-sm"
                >
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableHead style={{ width: "100px" }}>Active</TableHead>
                                <TableHead style={{ width: "140px" }}>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Dealer</TableHead>
                                <TableHead style={{ width: "120px", textAlign: "right" }}>Actions</TableHead>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {boats.map((boat, index) => (
                                    <motion.tr
                                        key={boat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell style={{ width: "100px" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                                                    <input
                                                        type="checkbox"
                                                        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                                                        checked={boat.active}
                                                        onChange={() => handleToggleActive(boat.id, boat.active)}
                                                        disabled={updatingActive.has(boat.id)}
                                                    />
                                                    <div
                                                        className="toggle-switch"
                                                        style={{
                                                            width: "44px",
                                                            height: "24px",
                                                            backgroundColor: boat.active ? "rgba(var(--theme-color), 1)" : "rgba(var(--border-color), 0.5)",
                                                            borderRadius: "12px",
                                                            position: "relative",
                                                            transition: "background-color 0.3s ease",
                                                            cursor: updatingActive.has(boat.id) ? "not-allowed" : "pointer",
                                                            opacity: updatingActive.has(boat.id) ? 0.6 : 1,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                top: "2px",
                                                                left: boat.active ? "22px" : "2px",
                                                                width: "20px",
                                                                height: "20px",
                                                                backgroundColor: "#fff",
                                                                borderRadius: "50%",
                                                                transition: "left 0.3s ease",
                                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                                            }}
                                                        />
                                                    </div>
                                                    
                                                </label>
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ width: "140px" }}>
                                            <div style={{ width: "120px", height: "80px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                                                {boat.main_image ? (
                                                    <Image
                                                        src={boat.main_image}
                                                        alt={boat.boat_data?.title || "Boat image"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(var(--light-bg-color), 1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "rgba(var(--content-color), 0.7)" }}>
                                                        No image
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ minWidth: "200px" }}>
                                            <div className="font-medium" style={{ wordBreak: "break-word" }}>{boat.boat_data?.title || "Untitled"}</div>
                                        </TableCell>
                                        <TableCell style={{ minWidth: "200px" }}>
                                            {boat.broker_data ? (
                                                <div className="text-sm text-muted-foreground" style={{ wordBreak: "break-word" }}>
                                                    {boat.broker_data.name}
                                                    {boat.broker_data.dealer && (
                                                        <span className="text-muted-foreground/70"> - {boat.broker_data.dealer}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No dealer</span>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ width: "120px", textAlign: "right" }} className="text-right">
                                            <Dropdown
                                                isOpen={openDropdowns.has(boat.id)}
                                                toggle={() => {
                                                    const newOpenDropdowns = new Set(openDropdowns);
                                                    if (newOpenDropdowns.has(boat.id)) {
                                                        newOpenDropdowns.delete(boat.id);
                                                    } else {
                                                        newOpenDropdowns.add(boat.id);
                                                    }
                                                    setOpenDropdowns(newOpenDropdowns);
                                                }}
                                                direction="end"
                                                className="boats-listing-dropdown-wrapper"
                                                style={{ display: 'flex', justifyContent: 'center' }}
                                            >
                                                <DropdownToggle
                                                    tag="button"
                                                    className="btn btn-sm btn-ghost p-0"
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        border: "none",
                                                        background: "transparent",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="visually-hidden">Open menu</span>
                                                </DropdownToggle>
                                                <DropdownMenu className="boats-listing-dropdown">
                                                    <DropdownItem
                                                        onClick={() => {
                                                            setOpenDropdowns(new Set());
                                                            handlePreview(boat.id);
                                                        }}
                                                        className="boats-listing-dropdown-item"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span>Preview</span>
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => {
                                                            setOpenDropdowns(new Set());
                                                            handleEdit(boat.id);
                                                        }}
                                                        className="boats-listing-dropdown-item"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownItem>
                                                    <DropdownItem divider />
                                                    <DropdownItem
                                                        onClick={() => {
                                                            setOpenDropdowns(new Set());
                                                            handleDelete(boat.id);
                                                        }}
                                                        disabled={deleting.has(boat.id)}
                                                        className="boats-listing-dropdown-item boats-listing-dropdown-item-danger"
                                                    >
                                                        {deleting.has(boat.id) ? (
                                                            <span className="spinner-border spinner-border-sm" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </span>
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                        <span>Delete</span>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </motion.div>
            )}
        </div>
    );
};

export default BoatsListing;
