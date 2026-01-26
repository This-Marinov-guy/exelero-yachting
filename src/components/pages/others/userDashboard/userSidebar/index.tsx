"use client";
import { useState, useEffect } from "react";
import ModalLogout from "@/components/commonComponents/modal/ModalLogout";
import { Href, Logout } from "@/constants";
import { SidebarItems } from "@/data/pages/Others";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveTab, setLogoutModal, setUserDashboardSidebar } from "@/redux/reducers/LayoutSlice";
import { Button, Col, Nav, NavItem, NavLink, Tooltip } from "reactstrap";
import UserProfile from "./UserProfile";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Lock1 } from "iconsax-react";

const UserSidebar = () => {
  const { UserDashboardSidebar, activeTab } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const [hasDealerInfo, setHasDealerInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const checkDealerInfo = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        setHasDealerInfo(false);
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

    // Listen for auth state changes
    const supabase = getSupabaseBrowserClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkDealerInfo();
    });

    // Listen for custom event when dealer data changes
    const handleDealerDataChanged = () => {
      checkDealerInfo();
    };
    
    window.addEventListener("dealerDataChanged", handleDealerDataChanged);

    // Check periodically for changes (every 5 seconds) as a fallback
    const interval = setInterval(() => {
      checkDealerInfo();
    }, 5000);

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(interval);
      window.removeEventListener("dealerDataChanged", handleDealerDataChanged);
    };
  }, []);

  const toggleTooltip = (id: string) => {
    setTooltipOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getItemLockStatus = (item: typeof SidebarItems[0]) => {
    if (item.id === "dealer-info") return false;
    return !hasDealerInfo;
  };

  return (
    <Col lg={3}>
      <div className={`left-sidebar filter-sidebar ${UserDashboardSidebar ? "open" : ""}`}>
        <Button className='close-btn' onClick={() => dispatch(setUserDashboardSidebar())}>
          <i className='ri-close-line' />
        </Button>
        <UserProfile />
        <Nav pills className='flex-column sidebar-list'>
          {SidebarItems.map((item, i) => {
            const isLocked = getItemLockStatus(item);
            const tooltipId = `tooltip-${item.id}`;

            return (
              <NavItem key={i}>
                <NavLink
                  href={Href}
                  className={`${item.id === activeTab ? " active" : ""} ${isLocked ? "locked" : ""}`}
                  color='transparent'
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLocked) {
                      dispatch(setActiveTab(item.id));
                    }
                  }}
                  id={tooltipId}
                >
                  {item.label}
                  {isLocked && <i className='ri-lock-line' />}
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
          <li>
            <a href={Href} className='btn-border danger' onClick={() => dispatch(setLogoutModal())}>
              {Logout}
            </a>
          </li>
        </Nav>
      </div>
      <ModalLogout />
    </Col>
  );
};

export default UserSidebar;
