import Amenities from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/Amenities";
import FloorPlans from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/FloorPlans";
import Location from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/Location";
import OverViewSection from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/Overview";
import PropertyDescription from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/PropertyDescription";
import ReviewProperty from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/Review";
import ScheduleTour from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/ScheduleTour";
import Video from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/Video";
import { AmenitiesTitle, FloorPlansTitle, LocationTitle, OverviewTitle, PropertyDescriptionTitle, ReviewsTitle, ScheduleTourTitle, VideoTitle } from "@/constants";
import { Autoplay, Navigation, Thumbs } from "swiper/modules";

export const PropertyTypeData = [
  { id: "status-one", label: "All", type: "all", count: 2285 },
  { id: "status-two", label: "Apartment", type: "apartment", count: 450 },
  { id: "status-three", label: "House", type: "house", count: 1050 },
  { id: "status-four", label: "Villa", type: "villa", count: 429 },
  { id: "status-five", label: "Office", type: "office", count: 230 },
  { id: "status-six", label: "Farmhouse", type: "farmhouse", count: 126 },
];

export const BhkOptions = [
  { id: "bed-1", label: "1 BHK", type: "1 BHK" },
  { id: "bed-2", label: "2 BHK", type: "2 BHK" },
  { id: "bed-3", label: "3 BHK", type: "3 BHK" },
  { id: "bed-4", label: "4 BHK", type: "4 BHK" },
  { id: "bed-5", label: "5 BHK", type: "5 BHK" },
];

export const AmenitiesData = [
  { id: "Amenity-1", label: "Air Conditioning", type: "Air Conditioning" },
  { id: "Amenity-2", label: "Doorman", type: "Doorman" },
  { id: "Amenity-3", label: "Family Room", type: "Family Room" },
  { id: "Amenity-4", label: "Parking", type: "Parking" },
  { id: "Amenity-5", label: "Waterfront", type: "Waterfront" },
  { id: "Amenity-6", label: "Onsite Parking", type: "Onsite Parking" },
  { id: "Amenity-7", label: "Fireplace", type: "Fireplace" },
  { id: "Amenity-8", label: "Hardwood Flows", type: "Hardwood Flows" },
  { id: "Amenity-9", label: "Dishwasher", type: "Dishwasher" },
  { id: "Amenity-10", label: "Dining Room", type: "Dining Room" },
  { id: "Amenity-10", label: "Cleaning Service", type: "Cleaning Service" },
  { id: "Amenity-11", label: "Central Heating", type: "Central Heating" },
  { id: "Amenity-12", label: "Unit Washer/Dryer", type: "Unit Washer/Dryer" },
  { id: "Amenity-13", label: "Pets Allowed", type: "Pets Allowed" },
  { id: "Amenity-14", label: "Wifi", type: "Wifi" },
  { id: "Amenity-15", label: "TV Cable", type: "TV Cable" },
  { id: "Amenity-16", label: "Microwave", type: "Microwave" },
  { id: "Amenity-17", label: "Refrigerator", type: "Refrigerator" },
  { id: "Amenity-18", label: "Gym", type: "Gym" },
];

export const SliderFor = {
  loop: true,
  spaceBetween: 10,
  modules: [Thumbs, Navigation],
  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
};

export const SliderNav = {
  loop: true,
  slidesPerView: 4,
  spaceBetween: 5,
  freeMode: true,
  watchSlidesProgress: true,
  modules: [Thumbs],
};

export const Sections = [
  { id: "overview", label: OverviewTitle, component: <OverViewSection />, labelComponent: <OverViewSection label /> },
  { id: "amenities", label: AmenitiesTitle, component: <Amenities />, labelComponent: <Amenities label /> },
  { id: "description", label: PropertyDescriptionTitle, component: <PropertyDescription />, labelComponent: <PropertyDescription label /> },
  { id: "floor", label: FloorPlansTitle, component: <FloorPlans />, labelComponent: <FloorPlans label /> },
  { id: "video", label: VideoTitle, component: <Video />, labelComponent: <Video label /> },
  { id: "location", label: LocationTitle, component: <Location />, labelComponent: <Location label /> },
  { id: "review", label: ReviewsTitle, component: <ReviewProperty />, labelComponent: <ReviewProperty label /> },
  { id: "schedule", label: ScheduleTourTitle, component: <ScheduleTour />, labelComponent: <ScheduleTour label /> },
];

export const OverviewData = [
  { svg: "house", title: "Property Type", text: "House", gif: "building.gif" },
  { svg: "bed", title: "Bedroom", text: "2", gif: "bed.gif" },
  { svg: "shower", title: "Bathroom", text: "2", gif: "shower.gif" },
  { svg: "garage", title: "Garage", text: "1", gif: "garage.gif" },
  { svg: "expand-arrows", title: "Sqft", text: "1400", gif: "dimensions.gif" },
  { svg: "calendar", title: "Year Built", text: "2020", gif: "appointment.gif" },
];

export const AmenitiesSliderData = [
  { image: "amenities/garden", title: "Garden" },
  { image: "amenities/air", title: "AC" },
  { image: "detail-main/8", title: "Balcony" },
  { image: "amenities/basement", title: "Basement" },
  { image: "amenities/gym", title: "GYM" },
  { image: "amenities/hall", title: "Hall" },
  { image: "amenities/microwave", title: "Microwave" },
  { image: "amenities/refrigerator", title: "Refrigerator" },
  { image: "amenities/sauna", title: "Sauna" },
  { image: "amenities/security", title: "Gard" },
  { image: "amenities/swimming-pool", title: "Swimming-pool" },
  { image: "amenities/washing", title: "Dryer" },
  { image: "amenities/wifi", title: "Wifi" },
  { image: "amenities/window", title: "Window covering" },
  { image: "amenities/tv", title: "TV" },
];

export const AmenitiesSlider = {
  slidesPerView: 4,
  spaceBetween: 10,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
  modules: [Autoplay],
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    375: {
      slidesPerView: 2,
      spaceBetween: 5,
    },
    768: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  },
};

export const PropertyDetails = [
  { label: "Property ID", value: "RN26" },
  { label: "Price", value: "$25,200" },
  { label: "Property Size", value: "1500 Sqft" },
  { label: "Garage Size", value: "400 Sqft" },
  { label: "Bedroom", value: "2" },
  { label: "Garage", value: "1" },
  { label: "Bathroom", value: "2" },
  { label: "Year Built", value: "2020" },
  { label: "Property Type", value: "Flat" },
  { label: "Property Status", value: "For Sale" },
];

export const DetailDescription = "Take the very height of luxury in this brand-new, ultra-modern masterpiece located on a one-third-acre site in the center of Arlington. It has six bedrooms, eight bathrooms, a three-car garage, and a private swimming pool included. MCLEAN CUSTOM BUILDERS offers a custom-designed home that blends seamlessly into the surrounding landscape. It provides the ultimate in seclusion and tranquility. Is a late spring or early summer 2024 delivery date anticipated? From the impressive al-fresco areas to the grand main doorway, every little detail has been meticulously thought out. The two-story living area with volume ceilings and a wall of Marvin windows welcomes you via 10-foot glass doors.";

export const FloorPlansDescription = "A walk-in closet and a bathroom with a vanity, toilet, and walk-in shower are also included in the attached bedroom. A walk-in closet and a bathroom with a vanity, toilet, and walk-in";

export const FloorItems = [
  {
    icon: "bed",
    count: 2,
    label: "Bedroom",
  },
  {
    icon: "shower",
    count: 2,
    label: "Bathroom",
  },
  {
    icon: "expand-arrows",
    count: 2,
    label: "Living Area",
  },
];

export const Reviews = [
  {
    img: "/1.jpg",
    name: "Erika Smith",
    date: "25 July 2018",
    helpful: { likes: 5, dislikes: 0 },
    rating: 4,
    comment: "This is a Nice Locality. Well maintained, peaceful location, neighborhoods are civilized and bureaucrats. Airport and hotel, hospital, school, nearby the location.",
  },
  {
    img: "/2.jpg",
    name: "Zachary Fields",
    date: "25 July 2018",
    helpful: { likes: 3, dislikes: 0 },
    rating: 4,
    comment: "Vasant Kunj is the neighborhood of the elite, residing with numerous diplomats of foreign countries and multiple embassies. The area is surrounded by the best schools, hospitals, shopping malls, movie theatres, clubs, restaurants and 5-star hotels which are nearby, which makes this home listing in South Delhi an exemplary choice for any family.",
  },
  {
    img: "/3.jpg",
    name: "Michele Parker",
    date: "25 July 2018",
    helpful: { likes: 8, dislikes: 0 },
    rating: 4,
    comment: "Vasant Kunj Farms is a super prime farmhouse community located closest to South Delhi. Many industrialists have their farmhouses here. Located close to Gurgaon and other prime areas of South Delhi and Airport.",
  },
];

export const DaysInMarch = Array.from({ length: 31 }, (_, i) => {
  const date = new Date(2024, 2, i + 1);
  return {
    day: date.toLocaleString("en-US", { weekday: "short" }),
    date: date.getDate(),
    month: "mar",
  };
});

export const ScheduleSlider = {
  slidesPerView: 7,
  spaceBetween: 20,
  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
  modules: [Navigation],
  breakpoints: {
    0: {
      slidesPerView: 3,
      spaceBetween: 5,
    },
    470: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 6,
      spaceBetween: 15,
    },
    1200: {
      slidesPerView: 7,
      spaceBetween: 20,
    },
  },
};

export const Time = Array.from({ length: 15 }, (_, i) => {
  const hour = Math.floor(i / 2) + 12;
  const minute = i % 2 === 0 ? "00" : "30";
  return {
    hour: hour,
    minute: minute,
  };
});

export const DetailPropertySlider = {
  slidesPerView: 4,
  spaceBetween: 30,
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
};

export const DetailCarSlider = {
  slidesPerView: 4,
  spaceBetween: 30,
  modules: [Navigation],
  navigation: {
    nextEl: ".car-related-next",
    prevEl: ".car-related-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 5,
    },
    368: {
      slidesPerView: 1.5,
      spaceBetween: 5,
    },
    470: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    991: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1400: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
};

export const TabData = [
  { id: "overview", label: "Overview", content: "Overview Content" },
  { id: "amenities", label: "Amenities", content: "Amenities Content" },
  { id: "description", label: "Property Description", content: "Property Description Content" },
  { id: "floor", label: "Floor Plans", content: "Floor Plans Content" },
  { id: "video", label: "Video", content: "Video Content" },
  { id: "location", label: "Location", content: "Location Content" },
];

export const BreadcrumbThumbNav = {
  slidesPerView: 7,
  spaceBetween: 10,
  loop: true,
  modules: [Thumbs],
  breakpoints: {
    0: {
      slidesPerView: 3,
      spaceBetween: 5,
    },
    470: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 6,
      spaceBetween: 15,
    },
    1200: {
      slidesPerView: 7,
      spaceBetween: 20,
    },
  },
};

export const BreadcrumbThumbs = {
  spaceBetween: 10,
  modules: [Thumbs],
};
