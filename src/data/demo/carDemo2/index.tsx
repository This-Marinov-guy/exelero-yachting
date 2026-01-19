import { Calendar1, Location } from "iconsax-react";
import { Pagination } from "swiper/modules";

export const CounterData = [
  { end: 135, suffix: "+", label: "Freelancer Joined" },
  { end: 8, prefix: "0", suffix: "%", label: "Years of Experience" },
  { end: 35, suffix: "K+", label: "Company Joined" },
];

export const DropdownData = [
  {
    id: 1,
    icon: <Location />,
    label: "Location",
    dropdownMenu: [{ title: "Amsterdam" }, { title: "Kansas City" }, { title: "Santiago" }, { title: "Lisbon" }, { title: "Los Angeles" }, { title: "Sydney" }, { title: "Beijing" }],
  },
  {
    id: 2,
    icon: <Calendar1 />,
    label: "Car Type",
  },
  {
    id: 3,
    icon: <Calendar1 />,
    label: "Price",
  },
];

export const AboutListData = [
  { src: "car2/1.svg", text: "Wide Selection of Vehicles" },
  { src: "car2/4.svg", text: "24/7 Customer Support" },
  { src: "car2/2.svg", text: "Flexible Booking Options" },
  { src: "car2/5.svg", text: "Convenient Airport Services" },
  { src: "car2/3.svg", text: "Insurance Coverage" },
];

export const stepsData = [
  {
    stepNumber: "01",
    title: "Search",
    description: "For finding the perfect vehicle for your journey, utilize our user-friendly search feature.",
  },
  {
    stepNumber: "02",
    title: "Choose",
    description: "Insurance coverage to GPS navigation systems, reserved to meet your specific preferences and requirements.",
  },
  {
    stepNumber: "03",
    title: "Customize",
    description: "Customize your reservation to fit your specific requirements for your memorable trip.",
  },
  {
    stepNumber: "04",
    title: "Confirmation",
    description: "Receive instant confirmation of your booking and prepare for an unforgettable journey!",
  },
];

export const ChooseUsContent = "We understand that you have options when it comes to renting a car for your travels. Here's why we believe we stand out from the rest.";

export const FeaturedCarContentData = "As one of the best-selling midsize sedans in America, the Camry offers an exceptional driving experience for both daily commutes and long road trips.";

export const StepBookingContentData = "When it comes to renting a car for your next adventure, we understand you have choices.";

export const servicesData = [
  {
    icon: "/car2/s-1.svg",
    title: "Mileage Unlimited",
  },
  {
    icon: "/car2/s-2.svg",
    title: "Pick up Services",
  },
  {
    icon: "/car2/s-3.svg",
    title: "Delivery to Door",
  },
];
export const OurDedicationContent = "We are committed to ensuring that every aspect of your rental experience is designed to bring you pleasure and contentment.";

export const BlogsContentData = "oin us on a heartwarming journey as we share the story of our happy family's adventures on the road.";

export const Blogs = [
  {
    image: "car2/blog/2.jpg",
    title: "Perfect Ride with Our Car Rental",
    description: "It’s about the experiences, the memories, and the freedom that come with each mile traveled.",
  },
  {
    image: "car2/blog/3.jpg",
    title: "A Beginner’s Guide to Car Maintenance",
    description: "Owning a car comes with the responsibility of regular maintenance to keep it running smoothly.",
  },
  {
    image: "car2/blog/4.jpg",
    title: "Why Understanding Your Car Matters",
    description: "Planning a road trip can be exciting, but ensuring your car is ready for the journey is crucial.",
  },
];

export const TestimonialsContentData2 = "Take a moment to read through these testimonials and gain insight into why we`re the preferred choice for travelers worldwide.";

export const Testimonials = [
  {
    text: "I am thoroughly impressed with the performance and reliability of my new car. The smooth ride and advanced features make every journey a pleasure.",
    name: "Sarah M.",
    designation: "Manager",
    rating: 4.5,
  },
  {
    text: "I recently purchased my dream car, and the entire experience was seamless. The customer service was top-notch, and I couldn't be happier with my new ride!",
    name: "Jane D.",
    designation: "Manager",
    rating: 4.5,
  },
  {
    text: "This is my third car from this dealership, and each time the process has been smooth and efficient. I highly recommend them to anyone looking for a reliable vehicle.",
    name: "Jane S.",
    designation: "Manager",
    rating: 4.5,
  },
  {
    text: "Excellent experience! The car was in perfect condition, and the team provided top-notch service from start to finish. Will definitely be coming back!",
    name: "Olivia D.",
    designation: "Manager",
    rating: 4.5,
  },
  {
    text: "The test drive was a breeze, and the team was very accommodating with my busy schedule. I’m thrilled with my new car and would definitely return for future purchases.",
    name: "Emily D.",
    designation: "Manager",
    rating: 4.5,
  },
  {
    text: "Amazing experience! The sales team was patient and listened to all my concerns. I ended up with a car I love and felt well taken care of throughout the entire process.",
    name: "Jessica T.",
    designation: "Manager",
    rating: 4.5,
  },
  {
    text: "I couldn’t have asked for a better experience. The staff was helpful and ensured I understood every aspect of my purchase. Loving my new car and the smooth process!",
    name: "Megan W.",
    designation: "Manager",
    rating: 4.5,
  },
];

export const InstagramImages = ["1", "2", "3", "4", "5", "6", "1", "2", "3", "4", "5", "6"];

export const Car2TestimonialData = {
  slidesPerView: 3,
  spaceBetween: 30,
  modules: [Pagination],
  className: "car2-testimonial-slider",
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1200: {
      slidesPerView: 3,
    },
  },
};

export const Car2InstagramSlider = {
  slidesPerView: 9,
  loop: true,
  breakpoints: {
    0: {
      slidesPerView: 2,
    },
    445: {
      slidesPerView: 3,
    },
    600: {
      slidesPerView: 4,
    },
    767: {
      slidesPerView: 5,
    },
    991: {
      slidesPerView: 6,
    },
    1299: {
      slidesPerView: 7,
    },
    1500: {
      slidesPerView: 8,
    },
    1650: {
      slidesPerView: 9,
    },
  },
  className:'car2-insta-slider ratio_square'
};