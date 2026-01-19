import { EffectFade, Navigation } from "swiper/modules";

export const Property2SwiperSetting = {
  effect: "fade",
  loop:true,
  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
  modules: [Navigation, EffectFade],
  className: "property2-featured-slider ratio_60",
};

export const ExperienceData = [
  {
    section: "experience-img",
    items: [
      {
        id: 1,
        position: "left",
        heading: {
          years: "08",
          text: "years of Experience",
        },
        image: {
          src: "/property2/experince/1.jpg",
          alt: "e-1",
          width: 301,
          height: 323,
        },
        hasEffectCircle: true,
      },
      {
        id: 2,
        position: "right",
        image: {
          src: "/property2/experince/2.jpg",
          alt: "e-2",
          width: 460,
          height: 520,
        },
        hasEffectCircle: true,
      },
    ],
  },
];

export const ExperiencePoints = ["knowledge of the local real estate market", "property trends and investment opportunities", "Clear and open communication"];

export const ServicesList = ["Comprehensive Services", "Innovative Marketing", "Expert Guidance", "Investment Expertise", "Personalized Approach", "Trusted Partner"];

export const AllServices = [
  {
    id: 1,
    title: "Sell Spaces",
    description: "We sell your space at the greatest market value and in a timely manner.",
    icon: "assets/svg/property/service/1.svg",
  },
  {
    id: 2,
    title: "Free Marketing",
    description: "We promote on many internet platforms to find the greatest real estate for you.",
    icon: "assets/svg/property/service/2.svg",
  },
  {
    id: 3,
    title: "Rent Spaces",
    description: "We provide free consultation to help you find a tenant for your new house.",
    icon: "assets/svg/property/service/3.svg",
  },
  {
    id: 4,
    title: "Buy Spaces",
    description: "We assist you in purchasing your ideal home for you and your family at the best possible price.",
    icon: "assets/svg/property/service/6.svg",
  },
];

export const CityList = [
  { country: "New York", properties: "120" },
  { country: "London", properties: "546" },
  { country: "Canada", properties: "354" },
  { country: "Germany", properties: "145" },
];

export const CounterData = [
  { count: 8, title: "Years of Experience" },
  { count: 135, title: "Home Brokers" },
  { count: 35, title: "Home Rented", k: "k" },
  { count: 10, title: "Win an Award" },
];

export const TestimonialData = [
  {
    id: 1,
    quote: "We couldn't have asked for a better experience with Premier Estates. From the moment we set foot in Serenity Cove, we knew it was the perfect place for our family.",
    name: "The Johnson Family",
    rating: 4.5,
    stars: 4,
    icon: "assets/svg/property2/quote.svg",
  },
  {
    id: 2,
    quote: "This fantastic staff helped us find our ideal house! Their advice proved to be useful, and the procedure went well. What a difference their experience made.",
    name: "The Grimsby Family",
    rating: 4.5,
    stars: 4,
    icon: "assets/svg/property2/quote.svg",
  },
  {
    id: 3,
    quote: "A achievement of a dream! The house is incredible and the neighborhood is peaceful and secure. We made the most important choice of our lives when we moved here.",
    name: "The Ashford Family",
    rating: 4.5,
    stars: 4,
    icon: "assets/svg/property2/quote.svg",
  },
];

export const SocialLinks = [
  { href: "https://www.facebook.com/", alt: "Facebook" },
  { href: "https://www.skype.com/en/", alt: "Skype" },
  { href: "https://www.instagram.com/", alt: "Instagram" },
  { href: "https://mail.google.com/", alt: "Email" },
];

export const TeamData = ["John Miller", "Mia Thomas", "Daniel Lewis", "Robert Taylor"];
