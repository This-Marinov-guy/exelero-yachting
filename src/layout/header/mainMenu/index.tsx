import { Href } from "@/constants";
import { MenuItem } from "@/data/layout/Header";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSidebarOpen } from "@/redux/reducers/LayoutSlice";
import UseOutsideDropdown from "@/utils/UseOutsideDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import ImageMenuList from "./ImageMenuList";
import PagesMegaMenu from "./PagesMegaMenu";
import SidebarSubMenu from "./SidebarSubMenu";

const MainMenu = ({ partners }: { partners: { slug: string; name: string }[] }) => {
  const pathname = usePathname();
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

  // Close mobile nav when route changes (e.g. after clicking a page link)
  useEffect(() => {
    dispatch(setSidebarOpen(false));
    setIsComponentVisible(false);
  }, [pathname, dispatch, setIsComponentVisible]);
  return (
    <nav ref={ref} className={`sidebar-nav ${isComponentVisible ? "open" : ""}`}>
      <div className='menu-header'>
        <h5 className='menu-title'>Menu</h5>
        <Link scroll={false} href={Href} className='close-btn' onClick={toggle}>
          <X className="h-5 w-5" />
        </Link>
      </div>
      <ul className='menu-items'>
        {partners.length > 0 && (
          <li className="expand-btn dropdown-menus">
            <button type="button" className={`menu-item ${openSections.Partners ? "open" : ""}`} onClick={() => toggleSection("Partners")} aria-expanded={!!openSections.Partners}>
              {t("Partners")} <span className="menu-chevron" aria-hidden>{openSections.Partners ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
            </button>
            <ul className="dropdown-megamenu sample link-list">
              {partners.map((partner) => <li key={partner.slug}><Link className="menu-link" href={`/partners/${partner.slug}`} onClick={toggle}>{partner.name}</Link></li>)}
            </ul>
          </li>
        )}
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
                onClick={() => hasSubmenu && mainMenu.title ? toggleSection(mainMenu.title) : toggle}
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
                  <SidebarSubMenu menu={mainMenu.children} level={0} onNavigate={toggle} />
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
