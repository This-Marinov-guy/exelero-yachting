export type ContactFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  number: number | string;
};

 
export interface DashboardDropdownProps {
  label: string;                  
  options: string[];              
  placeholder?: string;
}


interface InfoItem {
  label: string;
  value: string;
  isLink?: boolean;
}

export interface ProfileCardProps {
  title: string;
  data: InfoItem[];
  modalId: number;
}

export interface SwitchItemProps {
  title: string;
  description: string;
  checked?: boolean;
}

export interface PrivacyPolicySubItem {
  title?: string;
  content: string;
}

export interface PrivacyPolicyItem {
  id: string;
  title: string;
  content?: string;
  subsections?: boolean;
  subList?: PrivacyPolicySubItem[];
}

export interface PrivacyNavItem {
  id?: string;
  title?: string;
  subList?: PrivacyNavItem[];
}

export interface ScrollspyType {
  title?: string;
  list?: PrivacyNavItem[];
  content?: PrivacyPolicyItem[];
}
