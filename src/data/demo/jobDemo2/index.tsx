import { Navigation, Pagination } from "swiper/modules";

export const Cities = [
  ["Amsterdam", "Ankara", "Athens", "Atlantic", "Baltimore", "Bangkok", "Beijing", "Berlin", "Berne", "Brussels", "Budapest", "Buenos Aires", "Cairo", "Canberra", "Cannes", "Cape Town", "Chicago", "Cologne", "Copenhagen", "Damascus", "Delhi", "Dubai", "Dublin", "Florence", "Hague", "Havana", "Helsinki", "Hong Kong"],
  ["Honolulu", "Istanbul", "Jakarta", "Jerusalem", "Kansas City", "Kathmandu", "Kuala Lumpur", "Lisbon", "London", "Los Angeles", "Luxembourg", "Madrid", "Manila", "Melbourne", "Milan", "Montreal", "Moscow", "Munich", "Nazareth", "New York", "Nice", "Osaka", "Ottawa", "Paris", "Philadelphia", "Phnom Penh", "Prague"],
  ["Quito", "Reykjavik", "Rio de Janeiro", "San Francisco", "Santa Fe", "Santiago", "Shanghai", "Singapore City", "Stockholm", "Saint Petersburg", "Seoul", "Sydney", "Taipei", "Toronto", "Venice", "Vienna", "Washington", "Armenia", "Argentina", "Australia", "Aruba", "Belize", "Burundi", "Cape Verde", "Wokha", "Chile", "Ethiopia", "Zunheboto"],
];

export const CategoriesSwiperData = {
  slidesPerView: 6,
  spaceBetween: 30,
  loop: true,
  modules: [Navigation],
  navigation: {
    prevEl: ".dark-category-prev",
    nextEl: ".dark-category-next",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 5,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    },
    510: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    991: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1399: {
      slidesPerView: 4,
      spaceBetween: 15,
    },
    1602: {
      slidesPerView: 6,
      spaceBetween: 30,
    },
  },
};

export const BrowseByCategoryContent = "Explore different job categories to discover roles that match your interests.";

export const LatestJobOpeningsContent = "Stay updated with the newest job opportunities across industries, tailored to match your skills and career goals.";

export const ProvideJobsContent = "We will help you to find a job with your interests and help build your project more elegant";

export const PeopleSayContent = "Discover why job seekers everywhere are raving about fuso. Here's what they have to say!";

export const GoalCounters = [
  { value: 135, label: "Freelancer Joined" },
  { value: 8, label: "Years Experience" },
  { value: 35000, label: "Company Joined", isK: true },
];

export const ServiceList = ["Say goodbye to endless scrolling through unreliable job postings", "Receive personalized job suggestions that match your criteria.", `We're more than just a job board.`];

export const ServiceIcons = [
  { src: "/job/category/1.svg", alt: "s-1" },
  { src: "/job/category/5.svg", alt: "s-2" },
  { src: "/job/category/7.svg", alt: "s-3" },
];

export const PeopleSayData = [
  {
    quote: "I found my dream job within weeks! The personalized recommendations and comprehensive resources made all the difference in my job search journey.",
    name: "Sarah M.",
    role: "UI/UX Designer",
    image: "/dark-job/testimonial/1.jpg",
    rating: 5,
  },
  {
    quote: "I landed my ideal role in weeks thanks to personalized job recommendations, extensive resources, and tailored support.",
    name: "Sarah M.",
    role: "Marketing Specialist",
    image: "/dark-job/testimonial/1.jpg",
    rating: 5,
  },
  {
    quote: "Tailored tools and job suggestions were game-changers in my search, helping me find my dream job quickly and efficiently.",
    name: "James P.",
    role: "Graphic Designer",
    image: "/dark-job/testimonial/1.jpg",
    rating: 5,
  },
  {
    quote: "Rich resources and tailored job suggestions were useful to me in this search. I'm happy to have fast found a role that matches my goals and skill set.",
    name: "Olivia M.",
    role: "Human Resources Manager",
    image: "/dark-job/testimonial/1.jpg",
    rating: 5,
  },
  {
    quote: "Targeted job recommendations and resources helped me quickly secure my ideal position with invaluable support.",
    name: "Emma W.",
    role: "Data Analyst",
    image: "/dark-job/testimonial/1.jpg",
    rating: 5,
  },
  {
    quote: "Customized recommendations and resources helped me find a fantastic opportunity within weeks. I’m thrilled!",
    name: "Lucas G.",
    role: "UI/UX Designer",
    image: "/dark-job/testimonial/1.jpg",
    rating: 5,
  },
];

export const ReviewSwiperSetting = {
  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
  modules: [Navigation,Pagination],
  spaceBetween: 30,
  slidesPerView: 3,
  className: "dark-testimonial-slider",
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    991: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    1399: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
};
