import { CarDescriptionTitle, CarFeaturesTitle, FAQ, OverviewTitle, ReviewsTitle } from "@/constants";
import { Autoplay, EffectFade, FreeMode, Navigation, Thumbs } from "swiper/modules";

export const CarModalBrandsData = [
  {
    brand: "Rolls Royce",
    count: 355,
    id: 1,
    value: "royce",
    models: [
      { name: "Phantom", count: 62, id: "phantom" },
      { name: "Ghost", count: 30, id: "ghost" },
      { name: "Wraith", count: 35, id: "wraith" },
      { name: "Dawn", count: 28, id: "dawn" },
      { name: "Cullinan", count: 40, id: "cullinan" },
      { name: "Spectre", count: 45, id: "spectre" },
      { name: "Silver Ghost", count: 35, id: "silver_ghost" },
      { name: "Silver Wraith", count: 80, id: "silver_wraith" },
    ],
  },
  {
    brand: "Bentley",
    count: 427,
    id: 2,
    value: "bentley",
    models: [
      { name: "Bentayga", count: 50, id: "bentayga" },
      { name: "Continental GT", count: 70, id: "continental_gt" },
      { name: "Flying Spur", count: 65, id: "flying_spur" },
      { name: "Mulsanne", count: 95, id: "mulsanne" },
      { name: "Bacalar", count: 40, id: "bacalar" },
      { name: "Arnage", count: 20, id: "arnage" },
    ],
  },
  {
    brand: "Aston Martin",
    count: 309,
    id: 3,
    value: "martin",
    models: [
      { name: "DBX", count: 42, id: "dbx" },
      { name: "Vantage", count: 30, id: "vantage" },
      { name: "DB11", count: 25, id: "db11" },
      { name: "DB12", count: 65, id: "db12" },
      { name: "Valhalla", count: 50, id: "valhalla" },
      { name: "Valkyrie", count: 25, id: "valkyrie" },
      { name: "DB9", count: 38, id: "db9" },
      { name: "Cygnet", count: 34, id: "cygnet" },
    ],
  },
  {
    brand: "Maserati",
    count: 380,
    id: 4,
    value: "maserati",
    models: [
      { name: "Alfieri", count: 36, id: "alfieri" },
      { name: "Ghibli", count: 15, id: "ghibli" },
      { name: "Quattroporte", count: 10, id: "quattroporte" },
      { name: "Levante", count: 56, id: "levante" },
      { name: "MC20", count: 125, id: "mc20" },
    ],
  },
  {
    brand: "Bugatti",
    count: 205,
    id: 5,
    value: "bugatti",
    models: [
      { name: "Veyron", count: 20, id: "veyron" },
      { name: "Chiron", count: 56, id: "chiron" },
      { name: "Divo", count: 48, id: "divo" },
      { name: "Centodieci", count: 38, id: "centodieci" },
      { name: "Bolide", count: 43, id: "bolide" },
    ],
  },
  {
    brand: "Lamborghini",
    count: 454,
    id: 6,
    value: "lamborghini",
    models: [
      { name: "Aventador", count: 52, id: "aventador" },
      { name: "Huracán", count: 34, id: "huracan" },
      { name: "Urus", count: 51, id: "urus" },
      { name: "Sián", count: 85, id: "sian" },
      { name: "Revuelto", count: 65, id: "revuelto" },
      { name: "Huracán Tecnica", count: 75, id: "huracan_tecnica" },
    ],
  },
  {
    brand: "Ferrari",
    count: 241,
    id: 7,
    value: "ferrari",
    models: [
      { name: "Ferrari 296 GTB", count: 72, id: "ferrari_296_gtb" },
      { name: "Ferrari SF90 Stradale", count: 12, id: "ferrari_sf90_stradale" },
      { name: "Ferrari F8 Tributo", count: 56, id: "ferrari_f8_tributo" },
      { name: "Ferrari Roma", count: 30, id: "ferrari_roma" },
      { name: "Ferrari Portofino M", count: 45, id: "ferrari_portofino_m" },
      { name: "Ferrari 812 GTS", count: 26, id: "ferrari_812_gts" },
    ],
  },
  {
    brand: "Cadillac",
    count: 340,
    id: 8,
    value: "cadillac",
    models: [
      { name: "Cadillac CT4", count: 28, id: "cadillac_ct4" },
      { name: "Cadillac CT5", count: 45, id: "cadillac_ct5" },
      { name: "Cadillac CT6", count: 62, id: "cadillac_ct6" },
      { name: "Cadillac XT4", count: 59, id: "cadillac_xt4" },
      { name: "Cadillac Escalade", count: 67, id: "cadillac_escalade" },
      { name: "Cadillac Lyriq", count: 79, id: "cadillac_lyriq" },
    ],
  },
  {
    brand: "Lexus",
    count: 50,
    id: 9,
    value: "lexus",
    models: [
      { name: "Lexus IS", count: 10, id: "lexus_is" },
      { name: "Lexus ES", count: 25, id: "lexus_es" },
      { name: "Lexus GS", count: 15, id: "lexus_gs" },
    ],
  },
  {
    brand: "BMW",
    count: 213,
    id: 10,
    value: "BMW",
    models: [
      { name: "BMW iX1", count: 21, id: "bmw_ix1" },
      { name: "BMW iX", count: 56, id: "bmw_ix" },
      { name: "BMW i4", count: 48, id: "bmw_i4" },
      { name: "BMW Sedan", count: 68, id: "bmw_sedan" },
      { name: "BMW GRAN Turismo", count: 20, id: "bmw_gran_turismo" },
    ],
  },
  {
    brand: "Mercedes",
    count: 70,
    id: "main-check-eleven",
    value: "mercedes",
    models: [
      { name: "Mercedes-Benz GLA", count: 10, id: "mercedes_benz_gla" },
      { name: "Mercedes-Benz AMG", count: 15, id: "mercedes_benz_amg" },
      { name: "Mercedes-Benz C-Class", count: 20, id: "mercedes_benz_c_class" },
      { name: "Mercedes-Benz EQB", count: 25, id: "mercedes_benz_eqb" },
    ],
  },
];

export const FilterTabsListData = ["Most Popular", "User Rating (High to Low)", "Price (High to Low)", "$ High To Low", "Alphabetical A-Z", "Alphabetical Z-A", "Most Popular", "24 Product par page"];

export const FilterCategory = [
  { id: "categories-1", type: "all", label: "All Cars", count: 1530 },
  { id: "categories-2", type: "certified_cars", label: "Certified Cars", count: 815 },
  { id: "categories-3", type: "direct_owner_cars", label: "Direct Owner Cars", count: 215 },
  { id: "categories-4", type: "partner_cars", label: "Partner Cars", count: 375 },
  { id: "categories-5", type: "hot_deal", label: "Hot Deal", count: 125 },
];

export const FuelType = [
  { id: "fuel-1", type: "petrol", label: "petrol", count: 60 },
  { id: "fuel-2", type: "diesel", label: "diesel", count: 150 },
  { id: "fuel-3", type: "CNG", label: "CNG", count: 80 },
  { id: "fuel-4", type: "electric", label: "electric", count: 8 },
];

export const ModelYearData = [
  { id: "ModalYear-1", type: "2020", label: "2020 & above", count: 28 },
  { id: "ModalYear-2", type: "2016", label: "2016 & above", count: 10 },
  { id: "ModalYear-3", type: "2012", label: "2012 & above", count: 18 },
  { id: "ModalYear-4", type: "2008", label: "2008 & above", count: 25 },
];

export const SeatsData = [
  { id: "seats-1", type: "4", label: "4 seats", count: 20 },
  { id: "seats-2", type: "5", label: "5 seats", count: 5 },
  { id: "seats-3", type: "6", label: "6 seats", count: 10 },
  { id: "seats-4", type: "7", label: "7 seats", count: 15 },
];

export const ColorData = [
  { id: "color-1", type: "blue", label: "blue", count: 30 },
  { id: "color-2", type: "black", label: "Black", count: 65 },
  { id: "color-3", type: "silver", label: "Silver", count: 20 },
  { id: "color-4", type: "white", label: "White", count: 15 },
];

export const TransmissionData = [
  { id: "transmission-1", type: "manual", label: "Manual", count: 8 },
  { id: "transmission-2", type: "automatic", label: "Automatic", count: 60 },
  { id: "transmission-3", type: "semi_automatic", label: "Semi Automatic", count: 16 },
];

export const OwnerData = [
  { id: "owner-1", type: "1", label: "1st Owner", count: 28 },
  { id: "owner-2", type: "2", label: "2nd Owner", count: 10 },
  { id: "owner-3", type: "3", label: "3rd Owner", count: 18 },
  { id: "owner-4", type: "4", label: "4th Owner", count: 25 },
];

export const CarCategoryData = ["Sedan", "Jeep", "SUV", "Hatchback", "Truck", "Electric", "Convertible", "Coupe"];

export const CategoryInnerSlider = {
  slidesPerView: 6,
  spaceBetween: 30,
  freeMode: true,
  loop: true,
  speed: 2000,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
  modules: [FreeMode, Autoplay],
  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 30,
    },
  },
};

export const FiltersData = [
  {
    id: "condition-select",
    label: "Condition",
    options: [
      { value: "1", label: "New" },
      { value: "2", label: "Used" },
    ],
  },
  {
    id: "category-select",
    label: "Category",
    options: [
      { value: "1", label: "Bus" },
      { value: "2", label: "Car" },
      { value: "3", label: "Truck" },
      { value: "4", label: "Trailers" },
    ],
  },
  {
    id: "type-select",
    label: "Car Type",
    options: [
      { value: "1", label: "Diesel" },
      { value: "2", label: "Electric" },
      { value: "3", label: "Petrol" },
      { value: "4", label: "CNG" },
      { value: "5", label: "Hybrid" },
      { value: "6", label: "Convertible" },
    ],
  },
  {
    id: "models-select",
    label: "Any Models",
    options: [
      { value: "1", label: "2020 & above" },
      { value: "2", label: "2016 & above" },
      { value: "3", label: "2012 & above" },
      { value: "4", label: "2008 & above" },
    ],
  },
];

export const CarSvgData = [
  { icon: "calendar", label: "2021" },
  { icon: "gas", label: "250 miles" },
  { icon: "plan", label: "Manual", link: "" },
  { icon: "tachometer", label: "Petrol", link: "" },
];

export const CarOverViewDetail = [
  {
    id: 1,
    label: "Register Year",
    value: "Jun 2018",
  },
  {
    id: 2,
    label: "Body",
    value: "Kia",
  },
  {
    id: 3,
    label: "A Production Year",
    value: "2020",
  },
  {
    id: 4,
    label: "Transmission",
    value: "Manual",
  },
  {
    id: 5,
    label: "Engine Size",
    value: "6",
  },
  {
    id: 6,
    label: "Fuel Type",
    value: "Petrol",
  },
  {
    id: 7,
    label: "Color",
    value: "White, Blue, Red",
  },
  {
    id: 8,
    label: "VIN",
    value: "FCB123792",
  },
  {
    id: 9,
    label: "Seats",
    value: "7 Seats",
  },
  {
    id: 10,
    label: "Insurance Validity",
    value: "Third Party",
  },
  {
    id: 11,
    label: "Drive Type",
    value: "RWD – Rear-wheel drive",
  },
  {
    id: 12,
    label: "Mileage",
    value: "52201",
  },
  {
    id: 13,
    label: "Ownership",
    value: "Second Owner",
  },
  {
    id: 14,
    label: "Spare Key",
    value: "Yes",
  },
];

export const CarFeatures = [
  {
    category: "Interior",
    features: ["Air Conditioner", "Fabric Upholstery", "Heater", "Leather Seats", "Digital Clock", "Tachometer", "Touchscreen Display"],
  },
  {
    category: "Exterior",
    features: ["Rain Sensing Wiper", "Tinted Glass", "Integrated Antenna", "Sun Roof", "Moon Roof", "Chrome Grille", "Alloy Wheels"],
  },
  {
    category: "Safety",
    features: ["Child Safety Locks", "Central Locking", "Power Door Locks", "Driver Air Bag", "Keyless Entry", "Crash Sensor", "Rear Camera"],
  },
];

export const CarFaqs = [
  {
    id: "faqOne",
    question: "How often should I get my car serviced?",
    answer: "Experiences might differ even within the same dealership chain, so it's always a good idea to do your homework and read reviews pertaining to the dealership you're interested in.",
  },
  {
    id: "faqTwo",
    question: "How often should I change my car's oil?",
    answer: "Experiences might differ even within the same dealership chain, so it's always a good idea to do your homework and read reviews pertaining to the dealership you're interested in.",
  },
  {
    id: "faqThree",
    question: "What type of fuel should I use for my car?",
    answer: "Experiences might differ even within the same dealership chain, so it's always a good idea to do your homework and read reviews pertaining to the dealership you're interested in.",
  },
  {
    id: "faqFour",
    question: "What is the recommended tire pressure for my car?",
    answer: "Experiences might differ even within the same dealership chain, so it's always a good idea to do your homework and read reviews pertaining to the dealership you're interested in.",
  },
];

export const CarReviewType = [
  { label: "Comfort", status: "Perfect", width: "75" },
  { label: "Exterior Styling", status: "Perfect", width: "75" },
  { label: "Interior Design", status: "Good", width: "50" },
  { label: "Performance", status: "Excellent", width: "100" },
  { label: "Value For The Money", status: "Perfect", width: "75" },
  { label: "Reliability", status: "Good", width: "50" },
];

export const CarReviews = [
  {
    name: "Sarah J.",
    rating: 4.5,
    reviewDate: "2 Months Ago",
    reviewText: "I had an amazing experience buying my SUV from fuso. The staff was helpful and knowing, making the process smooth and satisfying. I'm overjoyed.",
  },
  {
    name: "David K.",
    rating: 4.5,
    reviewDate: "4 Months Ago",
    reviewText: "The service at fuso was top-notch from start to finish. I appreciated the transparency and honesty. I love my new sedan and will return for future buy.",
  },
];

export const InitialModalRatings = [
  { criteria: "Comfort", rating: 1 },
  { criteria: "Interior Design", rating: 1 },
  { criteria: "Value For The Money", rating: 1 },
  { criteria: "Exterior Styling", rating: 1 },
  { criteria: "Performance", rating: 1 },
  { criteria: "Reliability", rating: 1 },
];

export const DetailBreadcrumbsSlider = {
  slidesPerView: 4,
  breakpoints: {
    0: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 4,
    },
  },
};

export const ExpandCarSlider = {
  slidesPerView: 5,
  centeredSlides: true,
  grabCursor: true,
  loop: true,
  spaceBetween: 30,
  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    470: {
      slidesPerView: 2.5,
    },
    768: {
      slidesPerView: 3,
    },
    1400: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  },
};

export const CarDetailTabs = [
  { id: "overview", label: OverviewTitle },
  { id: "description", label: CarDescriptionTitle },
  { id: "features", label: CarFeaturesTitle },
  { id: "faq", label: FAQ },
  { id: "review", label: ReviewsTitle },
];

export const classicSliderData = {
  slidesPerView: 1,
  modules: [Navigation],
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
};

export const BackSlider = {
  spaceBetween: 10,
  effect: "fade",
  speed: 2000,
  grabCursor: true,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
  modules: [Thumbs, EffectFade, Autoplay],
};

export const FrontSlider = {
  spaceBetween: 20,
  slidesPerView: 4,
  freeMode: true,
  modules: [FreeMode],
  watchSlidesProgress: true,
  breakpoints: {
    0: {
      slidesPerView: 2.5,
      spaceBetween: 10,
    },
    470: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    991: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};
