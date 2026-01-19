import { Autoplay, Navigation } from "swiper/modules";

export const BlogContent1 = "Welcome, road warriors! If you dream of hitting the open road with the perfect ride, you're in the right place. Whether it’s a cross-country trip or a weekend getaway, the right vehicle can turn your journey into an unforgettable adventure.";

export const UnveilingContent1 = "In a world brimming with endless possibilities, the journey itself often holds the most profound experiences. Whether you're traversing scenic highways, exploring hidden gems, or simply seeking a new adventure, the right ride can make all the difference";

export const UnveilingContent2 = "At Road Warriors, we're passionate about helping you find your perfect vehicle. Our expert team is dedicated to providing you with the knowledge and tools you need to make informed decisions and turn your travel dreams into a reality.";

export const DetailList = [
  {
    title: "Know Your Terrain",
    description: "Choosing career tools and strategies is like picking the right vehicle for a road trip—align them with your goals for a smooth journey to success.",
  },
  {
    title: "Map Your Route",
    description: "Like planning a road trip with a detailed map, outline a clear career path. Set specific, actionable goals and milestones.",
  },
  {
    title: "Maintain Your Vehicle",
    description: "A well-maintained vehicle runs smoothly, just as continuous learning and development keep you at the top of your game.",
  },
  {
    title: "Navigate with Confidence",
    description: "Road trips often involve unexpected detours and roadblocks. Similarly, being adaptable in your career is key to navigating unforeseen changes.",
  },
  {
    title: "Enjoy the Journey",
    description: "Just as a road trip is about the experience as much as the destination, savor your career journey. Celebrate your achievements and milestones along the way.",
  },
];

export const BlogInfo = "Life Is a Journey, Not a Destination: Choose the Ride That Makes Every Mile an Adventure";

export const ConclusionData = [
  {
    description: "In conclusion, embarking on a journey as a road warrior means more than just having the right vehicle; it’s about the spirit of adventure, the freedom of the open road, and the memories made along the way.",
  },
  {
    description: "The perfect ride, equipped with the right features and comforts, transforms every trip into an unforgettable experience.",
  },
  {
    description: "Whether you’re exploring new destinations, rediscovering familiar routes, or simply enjoying the journey itself, the right vehicle makes all the difference. So gear up, hit the road, and let the adventures unfold. Adventure truly awaits with the perfect ride.",
  },
  {
    description: "From the anticipation of departure to the joy of discovering new destinations, and even the comfort of revisiting familiar routes, the right vehicle enhances every aspect of the journey.",
  },
  {
    description: "Adventure awaits with the perfect ride, making every journey unforgettable.",
  },
];
export const AuthorDescription = "Rose Roberts, a seasoned writer with over a decade of experience, explores technology, lifestyle, and personal development. Her compelling stories and insightful articles have earned her a loyal readership and a trusted voice in the blogosphere.";

export const ReviewBlog = [
  {
    name: "Rachel Rowe",
    profileImage: "/car/person/1.jpg",
    rating: 4.5,
    reviewDate: "10 days ago",
    reviewText: "That sounds fantastic! The right vehicle can make all the difference on your adventures. If you’re looking for tips on choosing the perfect ride or want advice on features to look for, just let me know!",
  },
  {
    name: "Megan Moore",
    profileImage: "/car/person/2.jpg",
    rating: 4.5,
    reviewDate: "10 days ago",
    reviewText: "Absolutely! The right vehicle can totally transform your adventures. If you need any tips on picking the ideal ride or advice on must-have features, feel free to reach out. I’d be happy to help!",
  },
  {
    name: "Monica Meyer",
    profileImage: "/car/person/3.jpg",
    rating: 3.5,
    reviewDate: "2 months ago",
    reviewText: "Whether you're heading cross-country or just out for the weekend, the right vehicle transforms your trip. From rugged off-roaders to sleek sedans, find your perfect ride and start your adventure with confidence.",
  },
];

export const SliderImage = ['4', '6', '3', '2', '9', '12', '17', '14', '20'];

export const BlogsDetailSliderData = {
  modules: [Navigation, Autoplay],
  slidesPerView: 1,
  speed: 2000,
  spaceBetween: 30,
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    },
    354: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    480: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    991: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    1200: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
  },
  navigation: {
    nextEl: ".blog-next-detail",
    prevEl: ".blog-prev-detail",
  },
}