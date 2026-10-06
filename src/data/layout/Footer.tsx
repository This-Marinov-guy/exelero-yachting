import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { FooterDetailType } from "@/types/Layout";
import { BROCHURE_DOWNLOAD_NAME, BROCHURE_URL } from "@/constants/brochure";
import { RouteList } from "@/utils/RouteList";
import CookieSettingsButton from "@/components/commonComponents/CookieSettingsButton";
import {
  MAIN_CONTACT_NUMBER,
  MAIN_CONTACT_EMAIL,
  MAIN_CONTACT_LOCATION,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  LINKEDIN_URL,
} from "@/utils/defines/CONTACTS";

const iconSize = 18;

export const HeaderClassMapFooter: { [key: string]: string } = {
  "car-2": "car2-footer",
  "job-2": "dark-footer-section section-t-space",
  "property-2": "property2-footer",
};

export const Details = [
  "Exelero Yachting",
  "Experience excellence in yachting with personalized service and world-class expertise.",
];

export const Copyright = (
  <div className="copyright">
    <p>@ {new Date().getFullYear()} Exelero Yachting. All Rights Reserved</p>
    <CookieSettingsButton />
  </div>
);

export const ContactListData = [
  { icon: <Phone size={iconSize} />, title: "Call", text: MAIN_CONTACT_NUMBER },
  { icon: <Mail size={iconSize} />, title: "Email", text: MAIN_CONTACT_EMAIL },
  { icon: <MapPin size={iconSize} />, title: "Location", text: MAIN_CONTACT_LOCATION },
];

export const SocialMediaData = [
  { url: INSTAGRAM_URL, label: "Instagram", icon: <Instagram size={iconSize} /> },
  { url: FACEBOOK_URL, label: "Facebook", icon: <Facebook size={iconSize} /> },
  { url: LINKEDIN_URL, label: "LinkedIn", icon: <Linkedin size={iconSize} /> },
];

export const FooterDetailData: FooterDetailType[] = [
  {
    title: "Navigation",
    links: [
      { title: "About us", url: RouteList.Pages.About },
      { title: "Contact", url: RouteList.Pages.Other.ContactUs1 },
    ],
  },
  {
    title: "Yachts",
    links: [
      { title: "New yachts", url: RouteList.Pages.NewYachts },
      { title: "Pre-owned yachts", url: RouteList.Pages.PreOwnedYachts },
      { title: "Boat brokerage", url: RouteList.Pages.Services.Boats },
    ],
  },
  {
    title: "Services",
    links: [
      { title: "Yacht Transportation", url: RouteList.Pages.Services.Transportation },
      { title: "Charters", url: RouteList.Pages.Services.Charters },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Download brochure", url: BROCHURE_URL, download: BROCHURE_DOWNLOAD_NAME },
    ],
  },
  {
    title: "Contact Info",
    contactList: true,
    links: [
      { title: MAIN_CONTACT_LOCATION, icon: <MapPin size={iconSize} /> },
      { title: MAIN_CONTACT_NUMBER, icon: <Phone size={iconSize} /> },
      { title: MAIN_CONTACT_EMAIL, icon: <Mail size={iconSize} /> },
    ],
  },
];
