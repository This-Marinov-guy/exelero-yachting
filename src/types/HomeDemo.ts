import { JSX, Key } from "react";

export interface JobHomeType {
  image: string;
  type: string;
  class?: string;
  key?: Key;
}

export interface JobHomeImageData {
  image: string;
  type: string;
  class?: string;
}

export interface JobHomeMeanClassData {
  meanClass: string;
  multipleImage: (JobHomeImageData | { childrenClass: string; childrenImage: JobHomeImageData[] })[];
}

export interface LogoSectionType {
  sectionClass?: string;
  swiperClass?: string;
  title?: string;
}

export interface DropdownMenu {
  title: string;
  icon?: JSX.Element;
}

export interface NavType {
  id: number;
  icon?: JSX.Element;
  dropdownMenu?: DropdownMenu[];
  rangeSlider?: boolean;
  label?: string;
  inputLabel: string;
  activeMenu?: boolean;
}

export interface FeaturedType {
  title: string;
  data: number[];
  label: string;
}


export interface NavType {
  id: number;
  icon?: JSX.Element;
  dropdownMenu?: DropdownMenu[];
  rangeSlider?: boolean;
  label?: string;
}

export interface JobHomeImageData {
  image: string;
  type: string;
  class?: string;
}

export interface JobHomeMeanClassData {
  meanClass: string;
  multipleImage: (JobHomeImageData | { childrenClass: string; childrenImage: JobHomeImageData[] })[];
}

export interface BlogModalProps {
  toggleClick: () => void;
  videoCall: boolean;
}

export interface CitySelectMenuProps {
  cityList: string[];  
  selectedCity: string | null; 
  onSelectCity: (city: string) => void;  
  href: string;  
  multiColumn? :boolean;
}

export interface FeaturedType {
  title: string;
  data: number[];
  label: string;
}
export interface SearchTabListType {
  basicTab?: string | number;
  showTab?: number[];
  datePicker?: boolean;
  scrollDown?: boolean;
  form?: boolean;
  pills?: boolean;
  endPoint?: number;
  tabs?: boolean;
  showNav?: boolean;
  button?: boolean;
  icon?: boolean;
  car2?:boolean;
}

export interface PropsType {
  type: string;
}