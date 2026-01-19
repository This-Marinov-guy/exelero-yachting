import { Mousewheel, Pagination, EffectFade } from "swiper/modules";

export const NavPortfolio = [
  { id: "all", label: "Show All", active: true },
  { id: "car", label: "Car", active: false },
  { id: "property", label: "Property", active: false },
  { id: "job", label: "Job", active: false },
];

export const PortfolioItems = [
  { image: "portfolio/1.jpg", backImage: "portfolio/4.jpg", slider: ["1", "16", "11", "7"], type: "car", title: "Voltura Lightning", text: "Voltura Motors" },
  { image: "portfolio/2.jpg", backImage: "portfolio/8.jpg", slider: ["2", "14", "9", "8"], type: "job", title: "Software Developer", text: "Technology" },
  { image: "portfolio/3.jpg", backImage: "portfolio/15.jpg", slider: ["3", "15", "12", "10"], type: "property", title: "Skyline Properties", text: "Residential" },
  { image: "portfolio/4.jpg", backImage: "portfolio/1.jpg", slider: ["4", "11", "6", "16"], type: "car", title: "TerraXion Voyager", text: "TerraXion Cars" },
  { image: "portfolio/5.jpg", backImage: "portfolio/12.jpg", slider: ["5", "3", "12", "10"], type: "property", title: "Urban Nest Realty", text: "Multi-family" },
  { image: "portfolio/6.jpg", backImage: "portfolio/11.jpg", slider: ["6", "4", "13", "4"], type: "car", title: "Orion Specter", text: "Orion AutoWorks" },
  { image: "portfolio/7.jpg", backImage: "portfolio/13.jpg", slider: ["7", "11", "1", "4"], type: "car", title: "Zephyr Tempest", text: "Zephyr Drive" },
  { image: "portfolio/8.jpg", backImage: "portfolio/2.jpg", slider: ["8", "14", "9", "4"], type: "job", title: "SEO Specialist", text: "Marketing" },
  { image: "portfolio/9.jpg", backImage: "portfolio/14.jpg", slider: ["9", "4", "14", "9"], type: "job", title: "Financial Analyst", text: "Finance" },
  { image: "portfolio/10.jpg", backImage: "portfolio/15.jpg", slider: ["10", "3", "5", "15"], type: "property", title: "Pinnacle Estates", text: "Luxury Homes" },
  { image: "portfolio/11.jpg", backImage: "portfolio/6.jpg", slider: ["11", "7", "4", "13"], type: "car", title: "Quantum Pulse", text: "Quantum Rides" },
  { image: "portfolio/12.jpg", backImage: "portfolio/5.jpg", slider: ["12", "5", "3", "10"], type: "property", title: "Seaside Homes LLC", text: "Vacation Rentals" },
  { image: "portfolio/13.jpg", backImage: "portfolio/7.jpg", slider: ["13", "1", "4", "6"], type: "car", title: "Voltura Lightning", text: "Voltura Motors" },
  { image: "portfolio/14.jpg", backImage: "portfolio/9.jpg", slider: ["14", "4", "9", "14"], type: "job", title: "Software Developer", text: "Technology" },
  { image: "portfolio/15.jpg", backImage: "portfolio/3.jpg", slider: ["15", "10", "3", "5"], type: "property", title: "Skyline Properties", text: "Residential" },
  { image: "portfolio/16.jpg", backImage: "portfolio/1.jpg", slider: ["16", "4", "1", "6"], type: "car", title: "TerraXion Voyager", text: "TerraXion Cars" },
];

export const PortfolioBoxSlider = {
  pagination: { clickable: true },
  effect: "fade",
  modules: [Pagination, Mousewheel, EffectFade],
};

export const CreativePortfolioBox = [
  {
    mainTitle: [
      {
        title: "UI/UX Designer",
        image: "/portfolio/full-img/uiux-designer.jpg",
        alt: "fi-1",
      },
      {
        title: "Brand",
        image: "/portfolio/full-img/brand.jpg",
        alt: "fi-2",
      },
      {
        title: "Creative",
        image: "/portfolio/full-img/creative.jpg",
        alt: "fi-7",
      },
      {
        title: "Job",
        image: "/portfolio/full-img/job.jpg",
        alt: "fi-9",
      },
    ],
  },
  {
    mainTitle: [
      {
        title: "Car Rental",
        image: "/portfolio/full-img/car-rental.jpg",
        alt: "fi-5",
      },
      {
        title: "Bungalows",
        image: "/portfolio/full-img/banglows.jpg",
        alt: "fi-8",
      },
      {
        title: "Modern",
        image: "/portfolio/full-img/modern.jpg",
        alt: "fi-6",
      },
    ],
  },
  {
    mainTitle: [
      {
        title: "Web Developer",
        image: "/portfolio/full-img/web-developer.jpg",
        alt: "fi-4",
      },
      {
        title: "Real Estate",
        image: "/portfolio/full-img/real-estate.jpg",
        alt: "fi-3",
      },
    ],
  },
];

export const PortfolioItemsCreative = [
  { title: "UI/UX Designer", imgSrc: "uiux-designer.jpg", alt: "fi-1" },
  { title: "Brand", imgSrc: "brand.jpg", alt: "fi-2" },
  { title: "Creative", imgSrc: "creative.jpg", alt: "fi-3" },
  { title: "Job", imgSrc: "job.jpg", alt: "fi-4" },
  { title: "Car Rental", imgSrc: "car-rental.jpg", alt: "fi-5" },
  { title: "Bungalows", imgSrc: "banglows.jpg", alt: "fi-6" },
  { title: "Modern", imgSrc: "modern.jpg", alt: "fi-7" },
  { title: "Web Developer", imgSrc: "web-developer.jpg", alt: "fi-8" },
  { title: "Real Estate", imgSrc: "real-estate.jpg", alt: "fi-9" },
];

export const ModernPortfolio = [
  {
    title: "UI/UX Designer",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/uiux-designer.jpg",
    imageAlt: "fi-1",
  },
  {
    title: "Brand",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/brand.jpg",
    imageAlt: "fi-2",
  },
  {
    title: "Real Estate",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/real-estate.jpg",
    imageAlt: "fi-3",
  },
  {
    title: "Web Developer",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/web-developer.jpg",
    imageAlt: "fi-4",
  },
  {
    title: "Car Rental",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/car-rental.jpg",
    imageAlt: "fi-1",
  },
  {
    title: "Modern",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/modern.jpg",
    imageAlt: "fi-2",
  },
  {
    title: "Creative",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/creative.jpg",
    imageAlt: "fi-3",
  },
  {
    title: "Bungalows",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/banglows.jpg",
    imageAlt: "fi-4",
  },
  {
    title: "Job",
    link: "portfolio-detail-1.html",
    imageSrc: "/portfolio/full-img/job.jpg",
    imageAlt: "fi-4",
  },
];

export const TheChallengeData = ["Lack of a strong digital platform and minimal visibility across online channels.", "Outdated, non-automated booking system leading to inefficiencies and errors.", "Difficulty in providing seamless and satisfying interactions for customers.", "Inefficient tracking and maintenance of the rental car fleet.", "Weak promotional efforts, resulting in poor customer reach and low brand awareness."];

export const OurApproachData = ["Designed with easy navigation and intuitive interfaces for seamless customer interactions.", "Allows customers to conveniently book services online, improving efficiency and reducing manual effort.", "Focused on delivering personalized and responsive services to ensure satisfaction.", "Streamlined vehicle tracking, maintenance, and logistics to optimize operations.", "Implemented to reach a broader audience, drive engagement, and boost conversions."];

export const TheSolutionData = ["Allows customers to book services instantly, providing convenience and efficiency.", "Streamlined navigation and user-friendly design minimize friction, enhancing the booking experience effortlessly.", "Utilizes data-driven strategies to engage the right audience and increase bookings effectively.", "Combining these features enables seamless operations, quick service delivery, and improved customer satisfaction."];

export const ResultsImpactData = ["Recent advancements have strengthened our standing in the market.", "We are delivering greater value to clients, improving overall customer satisfaction.", "Ongoing improvements and innovations in our services are key drivers of progress.", "Our commitment to innovation and enhanced services is helping us maintain a strong competitive edge."];

export const TheChallengePara = ["The rental car service struggled with limited online presence, a manual ooking system, poor customer experience, outdated fleet management, and ineffective rating strategies."];

export const BrandFlexData = [
  { title: "Brand", text: "Mercedes-Benz" },
  { title: "Date", text: "28-08-2024" },
];