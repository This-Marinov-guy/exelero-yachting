import { Href } from "@/constants";
import { MenuItem } from "@/data/layout/Header";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSidebarOpen } from "@/redux/reducers/LayoutSlice";
import UseOutsideDropdown from "@/utils/UseOutsideDropdown";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageMenuList from "./ImageMenuList";
import PagesMegaMenu from "./PagesMegaMenu";
import SidebarSubMenu from "./SidebarSubMenu";

const MainMenu = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const { sidebarOpen } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  const toggleSection = (title: string) => setOpenSections((prevState) => ({ [title]: !prevState[title] }));
  const { ref, isComponentVisible, setIsComponentVisible } = UseOutsideDropdown(sidebarOpen);

  const toggle = () => {
    setIsComponentVisible(!sidebarOpen);
    dispatch(setSidebarOpen(!isComponentVisible));
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(setSidebarOpen(isComponentVisible));
  }, [dispatch, isComponentVisible]);

  useEffect(() => setIsComponentVisible(sidebarOpen), [sidebarOpen, setIsComponentVisible]);
  return (
    <nav ref={ref} className={`sidebar-nav ${isComponentVisible ? "open" : ""}`}>
      <div className='menu-header'>
        <h5 className='menu-title'>Menu</h5>
        <Link scroll={false} href={Href} className='close-btn' onClick={toggle}>
          <i className='ri-close-line' />
        </Link>
      </div>
      <ul className='menu-items'>
        {MenuItem &&
          MenuItem.map((mainMenu, index) => {
            const hasSubmenu = mainMenu.children && mainMenu.children.length > 0;
            const hasMegaMenuImage = mainMenu.megaMenuImage || false;
            const hasMegaMenu = (mainMenu as any).megaMenu || false;
            return (
            <li className={`${hasSubmenu ? "expand-btn" : ""} ${!hasMegaMenuImage && !hasMegaMenu && hasSubmenu ? "dropdown-menus" : ""}`} key={index}>
              <Link 
                scroll={false} 
                href={hasSubmenu ? Href : (mainMenu.path || Href)} 
                className={`menu-item ${openSections[mainMenu.title] ? "open" : ""}`} 
                onClick={() => hasSubmenu ? toggleSection(mainMenu.title) : undefined}
              >
                {t(mainMenu.title)}
              </Link>
              {hasMegaMenuImage && mainMenu.children && <ImageMenuList mainMenu={mainMenu.children} toggleMain={toggle}/>}
              {!hasMegaMenuImage && !hasMegaMenu && hasSubmenu && mainMenu.children && (
                <ul className='dropdown-megamenu sample link-list'>
                  <SidebarSubMenu menu={mainMenu.children} level={0} />
                </ul>
              )}
              {hasMegaMenu && mainMenu.children && <PagesMegaMenu mainMenu={mainMenu.children} toggleMain={toggle}/>}
            </li>
            );
          })}
      </ul>
    </nav>
  );
};

export default MainMenu;
