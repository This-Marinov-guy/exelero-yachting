import ModalLogout from "@/components/commonComponents/modal/ModalLogout";
import { Href, Logout } from "@/constants";
import { SidebarItems } from "@/data/pages/Others";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveTab, setLogoutModal, setUserDashboardSidebar } from "@/redux/reducers/LayoutSlice";
import { Button, Col, Nav, NavItem, NavLink } from "reactstrap";
import UserProfile from "./UserProfile";

const UserSidebar = () => {
  const { UserDashboardSidebar, activeTab } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  return (
    <Col lg={3}>
      <div className={`left-sidebar filter-sidebar ${UserDashboardSidebar ? "open" : ""}`}>
        <Button className='close-btn' onClick={() => dispatch(setUserDashboardSidebar())}>
          <i className='ri-close-line' />
        </Button>
        <UserProfile />
        <Nav pills className='flex-column sidebar-list'>
          {SidebarItems.map((item, i) => {
            return (
              <NavItem key={i}>
                <NavLink href={Href} className={`${item.id === activeTab ? " active" : ""}`} color='transparent' onClick={() => dispatch(setActiveTab(item.id))}>
                  {item.label}
                </NavLink>
              </NavItem>
            );
          })}
          <li>
            <a href={Href} className='btn-border' onClick={() => dispatch(setLogoutModal())}>
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
