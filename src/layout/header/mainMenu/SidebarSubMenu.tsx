import { Fragment } from "react/jsx-runtime";
import { MenuListType } from "../../../types/Layout";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Href } from "@/constants";

type SidebarSubMenuProps = MenuListType & { onNavigate?: () => void };

const SidebarSubMenu: React.FC<SidebarSubMenuProps> = ({ menu, level, onNavigate }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const { t } = useTranslation();

  const toggleSection = (title: string) => setOpenSections((prevState) => ({ [title]: !prevState[title] }));
  const handleClick = (menuItem: (typeof menu)[number]) => {
    if (menuItem.children && menuItem.title) {
      toggleSection(menuItem.title);
    } else {
      onNavigate?.();
    }
  };
  return (
    <Fragment>
      {menu &&
        menu.map((menuItem, index) => (
          <li className={`${level === 0 && menuItem.children ? "dropdown-menus dropdown-right" : ""}${menuItem.children ? " expand-btn" : ""}`} key={index}>
            <Link href={menuItem.path ? menuItem.path : Href} className={`menu-link ${level === 0 && menuItem.children ? "menu-item" : ""}${menuItem.title && openSections[menuItem.title] ? " open" : ""}`} onClick={() => handleClick(menuItem)}>
              {t(menuItem.title ? menuItem.title : "")}
              {menuItem.children && (
                <span className="menu-chevron" aria-hidden>
                  {menuItem.title && openSections[menuItem.title] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              )}
            </Link>
            {menuItem.children && (
              <ul className='menu-right sample'>
                <SidebarSubMenu menu={menuItem.children} level={level + 1} onNavigate={onNavigate} />
              </ul>
            )}
          </li>
        ))}
    </Fragment>
  );
};

export default SidebarSubMenu;
