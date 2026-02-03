import { Href } from "@/constants";
import { MenuItem } from "@/data/layout/Header";
import { Partners } from "@/data/partners";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSidebarOpen } from "@/redux/reducers/LayoutSlice";
import UseOutsideDropdown from "@/utils/UseOutsideDropdown";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";
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
            const hasMegaMenu = mainMenu.megaMenu || false;
            return (
            <li className={`${hasSubmenu ? "expand-btn" : ""} ${!hasMegaMenuImage && !hasMegaMenu && hasSubmenu ? "dropdown-menus" : ""}`} key={index}>
              <Link 
                scroll={false} 
                href={hasSubmenu ? Href : (mainMenu.path || Href)} 
                className={`menu-item ${openSections[mainMenu.title ?? ""] ? "open" : ""}`} 
                onClick={() => hasSubmenu && mainMenu.title ? toggleSection(mainMenu.title) : undefined}
              >
                {t(mainMenu.title ?? "")}
                {hasSubmenu && (
                  <span className="menu-chevron" aria-hidden>
                    {openSections[mainMenu.title ?? ""] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                )}
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
      {/* Partner logos – shown in sidebar on mobile only */}
      <div className="sidebar-partner-logos" aria-label="Partner logos">
        <span className="sidebar-partner-logos__label">{t("Partners")}</span>
        <div className="sidebar-partner-logos__list">
          {Object.values(Partners).map((partner) => (
            <Link
              key={partner.id}
              href={partner.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-partner-logos__item"
              title={partner.name}
              onClick={toggle}
            >
              <div className="sidebar-partner-logos__image-wrapper">
                <Image
                  src={partner.logoImage}
                  alt={partner.name}
                  fill
                  className="sidebar-partner-logos__image"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MainMenu;
