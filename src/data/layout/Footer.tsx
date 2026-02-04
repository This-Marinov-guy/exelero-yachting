import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { FooterDetailType } from "@/types/Layout";
import { RouteList } from "@/utils/RouteList";
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
  "Exelero Yachting - Yachting and more.",
  "Experience excellence in yachting with personalized service and world-class expertise.",
];

export const Copyright = (
  <div className="copyright">
    <p>@ {new Date().getFullYear()} Exelero Yachting. All Rights Reserved</p>
  </div>
);

export const ContactListData = [
  { icon: <Phone size={iconSize} />, title: "Call", text: MAIN_CONTACT_NUMBER },
  { icon: <Mail size={iconSize} />, title: "Email", text: MAIN_CONTACT_EMAIL },
  { icon: <MapPin size={iconSize} />, title: "Location", text: MAIN_CONTACT_LOCATION },
];

export const SocialMediaData = [
  { url: INSTAGRAM_URL, icon: <Instagram size={iconSize} /> },
  { url: FACEBOOK_URL, icon: <Facebook size={iconSize} /> },
  { url: LINKEDIN_URL, icon: <Linkedin size={iconSize} /> },
];

export const FooterDetailData: FooterDetailType[] = [
  {
    title: "Navigation",
    links: [
      { title: "Boats", url: RouteList.Pages.Boats },
      { title: "Gallery", url: RouteList.Pages.Gallery },
      { title: "About", url: RouteList.Pages.About },
      { title: "Contact", url: RouteList.Pages.Other.ContactUs1 },
    ],
  },
  {
    title: "Partners",
    links: [
      { title: "X-Yachts", url: RouteList.Pages.Partners.XYachts },
      { title: "Elvstrom", url: RouteList.Pages.Partners.Elvstrom },
      { title: "Omaya Yachts", url: RouteList.Pages.Partners.OmayaYachts },
    ],
  },
  {
    title: "Services",
    links: [
      { title: "Sails", url: RouteList.Pages.Services.Sails },
      { title: "Clothes", url: RouteList.Pages.Services.Clothes },
      { title: "Boats", url: RouteList.Pages.Services.Boats },
      { title: "Transportation", url: RouteList.Pages.Services.Transportation },
      { title: "Sell Your Boat", url: RouteList.Pages.Services.SellYourBoat },
      { title: "Charters", url: RouteList.Pages.Services.Charters },
      { title: "Parts", url: RouteList.Pages.Services.Parts },
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
