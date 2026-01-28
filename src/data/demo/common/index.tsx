import { NavType } from "@/types/HomeDemo";
import { Building, Calendar, Car, Location, SearchNormal1, Wallet } from "iconsax-react";
import type { LucideIcon } from "lucide-react";
import { Facebook, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";

export const HomeTabData: NavType[] = [
  {
    id: 1,
    icon: <SearchNormal1 className='iconsax' />,
    label: "Search",
    inputLabel: "Enter Keyword...",
    dropdownMenu: [
      { title: "City,Locality", icon: <i className='ri-map-pin-line' /> },
      { title: "Area (like a Salmina)", icon: <i className='ri-map-pin-4-line' /> },
      { title: "Project or Builder name", icon: <i className='ri-building-4-line' /> },
    ],
  },
  {
    id: 2,
    icon: <Location className='iconsax' />,
    label: "Location",
    inputLabel: "Enter Location",
    dropdownMenu: [{ title: "Apartment" }, { title: "Kansas City" }, { title: "Santiago" }, { title: "Lisbon" }, { title: "Los Angeles" }, { title: "Sydney" }, { title: "Beijing" }],
    activeMenu:true
  },
  {
    id: 3,
    icon: <Calendar className='iconsax' />,
    label: "Pick up Date",
    inputLabel: "Choose your Date",
  },
  {
    id: 4,
    icon: <Calendar className='iconsax' />,
    label: "Pick up Time",
    inputLabel: "Choose your Time",
  },
  {
    id: 5,
    icon: <Car className='iconsax' />,
    label: "Car Type",
    inputLabel: "Enter Car Type",
    dropdownMenu: [{ title: "Hatchback" }, { title: "SUV" }, { title: "Convertible" }, { title: "Sedan" }, { title: "Crossover" }],
    activeMenu:true
  },
  {
    id: 6,
    icon: <Wallet className='iconsax'  />,
    label: "Price",
    inputLabel: "Enter Your Price",
  },
  {
    id: 7,
    icon: <Building className='iconsax'  />,
    label: "All Categories",
    inputLabel: "Enter Category Type",
    dropdownMenu: [{ title: "Education" }, { title: "Law & government" }, { title: "Arts" }, { title: "Construction" }, { title: "Finance" }, { title: "Technology" }, { title: "Communications" }, { title: "Health care" }],
    activeMenu:true
  },
  {
    id: 8,
    icon: <Wallet className='iconsax' />,
    label: "Job Type",
    inputLabel: "Enter Job Type",
    dropdownMenu: [{ title: "Freelance" }, { title: "Full Time" }, { title: "Internship" }, { title: "Part Time" }],
    activeMenu:true
  },
  {
    id: 9,
    icon: <Wallet className='iconsax' />,
    label: "Salary",
    inputLabel: "Enter Salary",
  },
  {
    id: 10,
    icon: <Building className='iconsax' />,
    label: "Property Type",
    inputLabel: "Enter Property Type",
    dropdownMenu: [{ title: "Apartment" }, { title: "House" }, { title: "Vila" }, { title: "Office" }, { title: "Farmhouse" }],
    activeMenu:true
  },
  {
    id: 11,
    icon: <Wallet className='iconsax'  />,
    label: "Price",
    inputLabel: "Enter Your Price",
  },
];

export const SocialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/",
    Icon: Facebook,
  },
  {
    name: "Twitter",
    url: "https://x.com/",
    Icon: Twitter,
  },
  {
    name: "LinkedIn",
    url: "https://in.linkedin.com/",
    Icon: Linkedin,
  },
  {
    name: "WhatsApp",
    url: "https://web.whatsapp.com/",
    Icon: MessageCircle,
  },
  {
    name: "Email",
    url: "https://mail.google.com/",
    Icon: Mail,
  },
] satisfies Array<{ name: string; url: string; Icon: LucideIcon }>;