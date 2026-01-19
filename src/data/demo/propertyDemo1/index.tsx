import { Autoplay, EffectFade, Navigation } from "swiper/modules";

export const PropertyHomeSliderSetting = {
  effect: "fade",
  modules: [EffectFade, Autoplay],
  freeMode: true,
  speed: 2000,
  autoplay: { delay: 1500, disableOnInteraction: false },
  loop: true,
};

export const PropertySwiperSetting = {
  effect: "fade",
  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
  modules: [Navigation],
  loop: true,
  className: "property-image-slider",
};

export const AboutList = ["45k partner has worked with us", "Professional & experienced humans resource", "Provide the best service for users", "We have more than 10 years of experience"];

export const PropertyAboutContent = "Discover the appropriate property that is most acceptable for you, ranging from houses for purpose that are minimalist to premium apartments for sale and rent with the greatest staff of our organization.";

export const PropertyServiceData = [
  { image: "property/service/1.svg", title: "Sell Spaces", text: "List your property and connect with buyers easily." },
  { image: "property/service/6.svg", title: "BUY SPACE", text: "Explore verified listings with expert guidance." },
  { image: "property/service/3.svg", title: "RENT SPACE", text: "Rent out or find tenants hassle-free." },
  { image: "property/service/2.svg", title: "FREE MARKETING", text: "Attract the right audience with free marketing." },
];

export const PropertyServiceContent = "We offer the best services to help you obtain your ideal home or free apartment.";

export const DiscoveryData = [
  { country: "United States", sale: "200", rent: "324", image: "1" },
  { country: "United Kingdom", sale: "100", rent: "628", image: "2" },
  { country: "Germany", sale: "125", rent: "256", image: "3" },
  { country: "Canada", sale: "124", rent: "245", image: "4" },
  { country: "France", sale: "126", rent: "267", image: "5" },
  { country: "Australia", sale: "127", rent: "278", image: "1" },
  { country: "Japan", sale: "128", rent: "289", image: "2" },
];

export const OurAchievementsContent = "We have over 25 years of experience. We've rented more than 250 properties and won awards for providing excellent customer service by fulfilling our customers' dreams and specifications.";

export const AchievementCounter = [
  { end: 20, label: "Year of Experience" },
  { end: 800, suffix: "+", label: "Home rented last year" },
  { end: 200, label: "Win An award" },
];

export const PropertyTestimonialData = [
  { name: "Hannan Odeth", review: "“I recently purchased a home through this Realty and I had an amazing experience. My agent, John, was incredibly professional and knowledgeable about the market. His attention to detail was impressive.”" },
  { name: "Esther Howard", review: `“With the most recent sale of my house, this&nbsp;was vital, and I couldn't be happier with the outcome! During the process, they offered dependable counsel because they were aware about the current industry trends.”` },
  { name: "Jenny Wilson", review: "“The process of renting the apartment was very smooth and straightforward. The leasing agent, Sarah, was very professional, responsive, and helpful in answering all my questions and concerns.”" },
];

export const DiscoverySlider = {
  slidesPerView: 5,
  spaceBetween: 30,
  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    575: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    991: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  },
};