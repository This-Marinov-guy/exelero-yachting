import { Autoplay, Navigation, Pagination } from "swiper/modules";

export const JobHomeSvg = [1, 2, 3, 6];

export const SelectExperience = ["Interneship", "Fresher", "Six Month", "One Year", "Two Year"];

export const Cities = [
  ["Amsterdam", "Ankara", "Athens", "Atlantic", "Baltimore", "Bangkok", "Beijing", "Berlin", "Berne", "Brussels", "Budapest", "Buenos Aires", "Cairo", "Canberra", "Cannes", "Cape Town", "Chicago", "Cologne", "Copenhagen", "Damascus", "Delhi", "Dubai", "Dublin", "Florence", "Hague", "Havana", "Helsinki", "Hong Kong"],
  ["Honolulu", "Istanbul", "Jakarta", "Jerusalem", "Kansas City", "Kathmandu", "Kuala Lumpur", "Lisbon", "London", "Los Angeles", "Luxembourg", "Madrid", "Manila", "Melbourne", "Milan", "Montreal", "Moscow", "Munich", "Nazareth", "New York", "Nice", "Osaka", "Ottawa", "Paris", "Philadelphia", "Phnom Penh", "Prague"],
  ["Quito", "Reykjavik", "Rio de Janeiro", "San Francisco", "Santa Fe", "Santiago", "Shanghai", "Singapore City", "Stockholm", "Saint Petersburg", "Seoul", "Sydney", "Taipei", "Toronto", "Venice", "Vienna", "Washington", "Armenia", "Argentina", "Australia", "Aruba", "Belize", "Burundi", "Cape Verde", "Wokha", "Chile", "Ethiopia", "Zunheboto"],
];

export const JobCategoriesScrollData = [
  {
    class: "scroll-quote",
    scrollData: [
      { image: "5", title: "Art & Design" },
      { image: "1", title: "Programming & Tech" },
      { image: "2", title: "Customer Support" },
      { image: "3", title: "Product Management" },
      { image: "7", title: "Video Editing" },
      { image: "8", title: "Writing & Translation" },
      { image: "4", title: "Finance & Accounting" },
    ],
  },
  {
    class: "scroll-quote reverse-quote",
    scrollData: [
      { image: "7", title: "Video Editing" },
      { image: "3", title: "Product Management" },
      { image: "2", title: "Customer Support" },
      { image: "1", title: "Programming & Tech" },
      { image: "4", title: "Finance & Accounting" },
      { image: "8", title: "Writing & Translation" },
      { image: "5", title: "Art & Design" },
    ],
  },
];

export const AboutImageData = [
  { image: "about.png", width: 500, height: 600 },
  { image: "objects.png", class: "object-dot position-absolute", width: 168, height: 58 },
  { image: "text-object1.png", class: "text-object1 position-absolute", width: 304, height: 110 },
  { image: "text-object2.png", class: "text-object2 position-absolute", width: 225, height: 118 },
];

export const About3List = ["Verified Job Listings", "Personalized Recommendations", "Comprehensive Resources", "Trusted Community"];

export const TopRatedCompanyContent = "Are you ready to take the next step in your career with a top-rated employer? . We're committed to excellence in every aspect of our business, and that starts with our talented team.";

export const InterviewQuestionContent = "where users can find sample interview questions tailored to specific industries or job roles. Here's how you might describe it:";

export const TabsData = [
  { id: "pills-part", label: "Part Time" },
  { id: "pills-full", label: "Full Time" },
  { id: "pills-internship", label: "Internship" },
  { id: "pills-wfo", label: "WFO" },
  { id: "pills-wfh", label: "WFH" },
  { id: "pills-remote", label: "Remote" },
  { id: "pills-freelancing", label: "Freelancing" },
];

export const JobCityData = [
  { image: "1.jpg", title: "Canada" },
  { image: "2.jpg", title: "New York" },
  { image: "3.jpg", title: "Sydney" },
  { image: "4.jpg", title: "London" },
  { image: "1.jpg", title: "Canada" },
  { image: "2.jpg", title: "New York" },
  { image: "3.jpg", title: "Sydney" },
  { image: "4.jpg", title: "London" },
];

export const ExploreCityData = {
  navigation: {
    prevEl: ".job-category-prev",
    nextEl: ".job-category-next",
  },
  slidesPerView: 4,
  spaceBetween: 30,
  loop: true,
  modules: [Navigation],
  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 10,
      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
    },
    991: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1199: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
};

export const QuestionData = [
  {
    title: "Software Engineer",
    questions: "100k+ Questions",
  },
  {
    title: "Graphic Designer",
    questions: "90k+ Questions",
  },
  {
    title: "Web Developer",
    questions: "10.10k+ Questions",
  },
  {
    title: "Data Analytics",
    questions: "7.5k+ Questions",
  },
  {
    title: "Hr Manager",
    questions: "50.2k+ Questions",
  },
];

export const FAQImageData = [
  {
    src: "/job-3/about/faq-object.png",
    alt: "faq-object",
    className: "img-fluid faq-top-object position-absolute",
    height: 58,
    width: 113,
  },
  {
    src: "/job-3/about/objects.png",
    alt: "faq-object",
    className: "img-fluid faq-bottom-object position-absolute",
    height: 58,
    width: 168,
  },
  {
    src: "/job-3/about/faq.png",
    alt: "faq",
    className: "img-fluid",
    height: 571,
    width: 613,
  },
];

export const PaymentData = [
  { image: "gpay.png", utl: "https://play.google.com/store/games?utm_source=apac_med&hl=en-IN&utm_medium=hasem&utm_content=Jan0324&utm_campaign=Evergreen&pcampaignid=MKT-EDR-apac-in-1707570-med-hasem-py-Evergreen-Jan0324-Text_Search_BKWS-BKWS%7CONSEM_kwid_43700080171622579_creativeid_694609712127_device_c&gad_source=1&gclid=CjwKCAjw8fu1BhBsEiwAwDrsjAWRsKs1pKLHt1bBX6bjz9PJ3IdJtTcOVvH0HT4U7dqtG6W7yuH_MxoCaZ8QAvD_BwE&gclsrc=aw.ds" },
  { image: "app-store.png", utl: "https://www.apple.com/in/app-store/" },
];

export const SVGImage = [
  { image: 1, width: 183, height: 119 },
  { image: 2, width: 180, height: 180 },
  { image: 3, width: 148, height: 116 },
];

export const Job3BoxSlider = {
  slidesPerView: 4,
  spaceBetween: 30,
  modules: [Pagination],
  className:'job3-box-slider',
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    575: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    991: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1399: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
  pagination: {
    clickable: true,
  },
};

export const Job3Logo = {
  slidesPerView: 5,
  spaceBetween: 120,
  loop: true,   
  modules: [Autoplay], 
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },  
  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    400: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    767: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    991: {
      slidesPerView: 5,
      spaceBetween: 50,
    },
    1399: {
      slidesPerView: 5,
      spaceBetween: 120,
    },
  },
};