import { JSX } from "react";

export interface MenuItemType {
  title?: string;
  children?: MenuItemType[];
  type?: string;
  active?: boolean;
  section?: MenuItemType[];
  url?: string;
  megaMenuImage?: boolean;
  path?: string;
  image?: string;
  megaMenu?: boolean;
}

export interface MenuListType {
  menu: MenuItemType[] | undefined;
  level: number;
}

export interface MainMenu {
  mainMenu:MenuItemType[]
  toggleMain: () => void;
}

 
 

export interface FooterListType {
  title: string;
  url?: string;
  icon?: string;
}

export interface FooterDetailType {
  title: string;
  contactList?: boolean;
  links: FooterListType[];
}

export interface LoaderConfig {
  src?: string;
  text?: string;
  svg?: JSX.Element;
  height?: number;
  width?: number;
}

export interface PathTypes {
  part?: string | any;
}

export interface PathSettings {
  className: string;
  favicon: string;
}

export interface LeftHeaderProps {
  sidebarOpen?: boolean;
  part?: string;
  isJobOrProperty?: boolean;
}

export interface RightHeaderProps {
  part?: string;
  isJobOrProperty?: boolean;
}

export interface PropertyDropDownProps {
  part?: string;
  isJobOrProperty?: boolean;
}

export interface FooterSectionProps {
  data: Array<{
    title: string;
    contactList?: boolean;
    links: Array<{
      title: string;
      url?: string;
      icon?: string;
    }>;
  }>;
  footerDemo?: boolean;
}