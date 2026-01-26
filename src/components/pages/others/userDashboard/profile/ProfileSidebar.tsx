"use client";
import { useState, useEffect } from "react";
import { Nav, NavItem, NavLink, Tooltip } from "reactstrap";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Lock } from "lucide-react";

type ProfileSidebarProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
    refreshTrigger?: number;
};

const ProfileSidebar = ({ activeTab, onTabChange, refreshTrigger }: ProfileSidebarProps) => {
    const [hasDealerInfo, setHasDealerInfo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const checkDealerInfo = async () => {
            const supabase = getSupabaseBrowserClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("broker_data")
                .select("id")
                .eq("user_id", session.user.id)
                .limit(1);

            setHasDealerInfo(!!data && data.length > 0);
            setLoading(false);
        };

        checkDealerInfo();
    }, [refreshTrigger]);

    const toggleTooltip = (id: string) => {
        setTooltipOpen((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const menuItems = [
        { id: "dealer-info", label: "Dealer Info", locked: false },
        { id: "upload-boat", label: "Upload Boat", locked: !hasDealerInfo },
        { id: "boats-listing", label: "Boats Listing", locked: !hasDealerInfo },
    ];

    if (loading) {
        return <div className="profile-sidebar-loading">Loading...</div>;
    }

    return (
        <div className="profile-sidebar">
            <Nav pills className="flex-column profile-sidebar-nav">
                {menuItems.map((item) => {
                    const isLocked = item.locked;
                    const tooltipId = `tooltip-${item.id}`;

                    return (
                        <NavItem key={item.id}>
                            <NavLink
                                href="#"
                                className={`profile-sidebar-item ${activeTab === item.id ? "active" : ""} ${isLocked ? "locked" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!isLocked) {
                                        onTabChange(item.id);
                                    }
                                }}
                                id={tooltipId}
                            >
                                {item.label}
                                {isLocked && <Lock className='lock-icon' style={{ width: '16px', height: '16px' }} />}
                            </NavLink>
                            {isLocked && (
                                <Tooltip
                                    isOpen={!!tooltipOpen[tooltipId]}
                                    target={tooltipId}
                                    toggle={() => toggleTooltip(tooltipId)}
                                    placement="right"
                                >
                                    This section is locked until you have a dealer saved
                                </Tooltip>
                            )}
                        </NavItem>
                    );
                })}
            </Nav>
        </div>
    );
};

export default ProfileSidebar;
