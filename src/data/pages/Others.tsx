import { Href } from "@/constants";
import { IconLinkList } from "@/types/CommonComponents";
import { RouteList } from "@/utils/RouteList";
import { ApexOptions } from "apexcharts";
import { Call, CallCalling, Car, Driving, Global, Location, Message, MessageQuestion, Mobile, ReceiptText, Sms, Tag2 } from "iconsax-react";
import { Autoplay, Navigation } from "swiper/modules";

export const AboutBottomContent = [
  {
    iconSrc: "/car/about/timer.svg",
    iconAlt: "timer",
    text: "Mileage unlimited",
  },
  {
    iconSrc: "/car/about/driving.svg",
    iconAlt: "timer",
    text: "Pick up service",
  },
  {
    iconSrc: "/car/about/door.svg",
    iconAlt: "timer",
    text: "Delivery to door",
  },
];

export const About1content = "We provide free consultation to help you find a tenant for your new house.We provide free consultation to help you find a tenant for your new house.We provide free consultation to help .";

export const BrowseCategoryData = [
  {
    id: 1,
    category: "Car for rent",
    description: "Rent a car for flexible travel and the freedom to explore at your own pace.",
    icon: <Driving className="iconsax"/>,
    image: "job/job-box/dots-category.svg",
  },
  {
    id: 2,
    category: "Car for sale",
    description: "Reliable car for sale: low mileage, excellent condition, great value—test drive now!",
    icon: <Tag2 className="iconsax" />,
    image: "job/job-box/dots-category.svg",
  },
  {
    id: 3,
    category: "Book your car",
    description: "Book your car now to enjoy personalized travel with convenience and freedom.",
    icon: <Car className="iconsax" />,
    image: "job/job-box/dots-category.svg",
  },
  {
    id: 4,
    category: "Support 24/7*",
    description: "Our help is accessible around-the-clock to make sure you get help when you need it.",
    icon: <Call className="iconsax" />,
    image: "job/job-box/dots-category.svg",
  },
];

export const PrimeCarRentalsContent = "At Prime Car Rentals, we pride ourselves on delivering top-tier car rental services that cater to a wide range of needs, from business trips to family vacations.";

export const About2List = [
  {
    id: 1,
    feature: "Extensive Fleet",
    icon: "ri-check-line",
  },
  {
    id: 2,
    feature: "Convenient Locations",
    icon: "ri-check-line",
  },
  {
    id: 3,
    feature: "Affordable Rates",
    icon: "ri-check-line",
  },
  {
    id: 4,
    feature: "Flexible Rental Options",
    icon: "ri-check-line",
  },
  {
    id: 5,
    feature: "Exceptional Customer Service",
    icon: "ri-check-line",
  },
];

export const About3StartImage = [[{ src: "job/about/1.png" }, { src: "job/about/2.png" }], [{ src: "job/about/3.png" }]];

export const AboutTeamData = [
  { name: "Daniel Thompson", image: "other/about/p-1.jpg" },
  { name: "James Miller", image: "other/about/p-2.jpg" },
  { name: "Ryan Clark", image: "other/about/p-3.jpg" },
  { name: "Amanda Rodriguez", image: "other/about/p-4.jpg" },
  { name: "Justin Martin", image: "other/about/p-5.jpg" },
  { name: "John Miller", image: "property2/team/1.jpg" },
  { name: "Mia Thomas", image: "property2/team/2.jpg" },
  { name: "Daniel Lewis", image: "property2/team/3.jpg" },
  { name: "Robert Taylor", image: "property2/team/4.jpg" },
  { name: "Alice Johnson", type: "Project Manager", image: "other/team/t-1.jpg" },
  { name: "Bob Smith", type: "Senior Developer", image: "other/team/t-2.jpg" },
  { name: "Cathy Brown", type: "UX/UI Designer", image: "other/team/t-3.jpg" },
  { name: "David Lee", type: "QA Engineer", image: "other/team/t-4.jpg" },
  { name: "Jack Taylor", type: "Sales Executive", image: "other/team/t-5.jpg" },
  { name: "Emma Davis", type: "Product Owner", image: "other/team/t-6.jpg" },
  { name: "John Deo", type: "Web Design", image: "other/team/t-7.jpg" },
  { name: "Liam Harris", type: "Data Analyst", image: "other/team/t-8.jpg" },
];

export const AboutTeamSlider = {
  slidesPerView: 5,
  spaceBetween: 30,
  navigation: {
    nextEl: ".about-team-next",
    prevEl: ".about-team-prev",
  },
  modules: [Navigation],
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    375: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    767: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    991: {
      slidesPerView: 4,
      spaceBetween: 15,
    },
    1299: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  },
};

export const AboutGetInTouchData = [
  {
    id: 1,
    title: "Our Location",
    description: "05 West St, Suite New York 10016",
    icon: <Location className="iconsax" />,
  },
  {
    id: 2,
    title: "Our Email Address",
    description: "maryjrios@rhyta.com",
    icon: <Sms className="iconsax" />,
    link: Href,
  },
  {
    id: 3,
    title: "Contact Number",
    description: "860-349-8349",
    icon: <CallCalling className="iconsax" />,
    link: Href,
  },
  {
    id: 4,
    title: "Our Website",
    description: "www.fuso.com",
    icon: <Global className="iconsax" />,
    link: Href,
  },
];

export const ContactPlaceholder = [
  { label: "First Name", type: "text" },
  { label: "Last Name", type: "text" },
  { label: "PhoneNumber", type: "number" },
  { label: "Email", type: "email" },
];

export const Contact1Description = "For any questions or feedback, reach out to us via phone, email, or the form below. Your satisfaction is our priority. We look forward to hearing from you!";

export const Contact2MainData = [
  {
    id: 1,
    title: "Chat To Sales",
    description: "See our frequently asked questions.",
    link: RouteList.Pages.Other.ContactUs1,
    linkText: "Chat to sales",
    icon: <Message className='iconsax' size={50} color='#188aec' />,
  },
  {
    id: 2,
    title: "Our Location",
    description: "Speak to someone from our sales team today.",
    link: "https://www.google.com/maps",
    linkText: "visit location",
    icon: <Location className='iconsax' size={50} color='#188aec' />,
  },
  {
    id: 3,
    title: "Get Help Center",
    description: "Speak to our team today and ask anything about Coast.",
    link: RouteList.Pages.Other.ContactUs1,
    linkText: "Get Answer",
    icon: <MessageQuestion className='iconsax' size={50} color='#188aec' />,
    col: "4",
  },
  {
    id: 4,
    title: "Call Us",
    description: "See how Coast can help your business by getting early access.",
    link: RouteList.Pages.Other.ContactUs1,
    linkText: "Call our team",
    icon: <CallCalling className='iconsax' size={50} color='#188aec' />,
    col: "4",
  },
  {
    id: 5,
    title: "Press & Media",
    description: "Get in touch with our PR team today.",
    link: RouteList.Pages.Other.ContactUs1,
    linkText: "Get Answer",
    icon: <ReceiptText className='iconsax' size={50} color='#188aec' />,
    col: "4",
  },
];
export const contactUs3Description = "For any questions or feedback, reach out to us via phone, email, or the form below. Your satisfaction is our priority. We look forward to hearing from you!";

export const ServiceCount = [
  {
    id: 1,
    value: 10,
    suffix: <i className='ri-add-line' />,
    title: "Years in Business",
  },
  {
    id: 2,
    value: 98,
    suffix: "%",
    title: "Positive Reaction",
  },
  {
    id: 3,
    value: 4,
    suffix: <i className='ri-add-line' />,
    title: "Successful Projects",
  },
  {
    id: 4,
    value: 152,
    suffix: <i className='ri-add-line' />,
    title: "Satisfied Client",
  },
];

export const TeamSectionDescription = `Greetings from our team, which brings empathy and creativity! Our unique skill set of motivated people are linked by a common desire for success and dedication to achieving the team's goals.`;

export const OtherTeamData = [
  {
    name: "Alice Johnson",
    designation: "Project Manager",
    image: "/other/team/t-1.jpg",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/",
      linkedin: "https://in.linkedin.com/",
    },
  },
  {
    name: "Bob Smith",
    designation: "Senior Developer",
    image: "/other/team/t-2.jpg",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/",
      linkedin: "https://in.linkedin.com/",
    },
  },
  {
    name: "Cathy Brown",
    designation: "UX/UI Designer",
    image: "/other/team/t-3.jpg",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/",
      linkedin: "https://in.linkedin.com/",
    },
  },
  {
    name: "David Lee",
    designation: "QA Engineer",
    image: "/other/team/t-4.jpg",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/",
      linkedin: "https://in.linkedin.com/",
    },
  },
  {
    name: "Jack Taylor",
    designation: "Sales Executive",
    image: "/other/team/t-5.jpg",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/",
      linkedin: "https://in.linkedin.com/",
    },
  },
  {
    name: "Emma Davis",
    designation: "Product Owner",
    image: "/other/team/t-6.jpg",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/",
      linkedin: "https://in.linkedin.com/",
    },
  },
  {
    name: "John Deo",
    designation: "Web Design",
    image: "/other/team/t-7.jpg",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/",
      linkedin: "https://in.linkedin.com/",
    },
  },
  {
    name: "Liam Harris",
    designation: "Data Analyst",
    image: "/other/team/t-8.jpg",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/",
      linkedin: "https://in.linkedin.com/",
    },
  },
];

export const PersonsDetail = [
  {
    id: 1,
    image: "/other/person2.png",
    alt: "Noah Evans",
    quote: "Designing Insightful Solutions for Creative Applications.",
    description: `Welcome to Fuso, where quality meets creativity. We're proud to provide tailored solutions designed to meet a wide range of client needs. Our business was founded with a mission to redefine industry standards, blending insight with innovative design to deliver exceptional results.`,
    name: "Noah Evans",
    title: "Marketing Manager",
    isRightAligned: false,
  },
  {
    id: 2,
    image: "/other/person.png",
    alt: "Jessica Doe",
    quote: "The bridge that connects understanding with knowledge is design.",
    description: `Welcome to Fuso, the place where quality and creativity combine. We take great satisfaction knowing that we offer creative suggestions that are customized in order to meet an extensive variety of demands of our clients. The business we operate originated to redefine standards in the industry.`,
    name: "Jessica Doe",
    title: "Design Manager",
    isRightAligned: true,
  },
];

export const PricingPlans = [
  {
    id: 1,
    title: "Standard",
    description: "Perfect for Individuals",
    price: "$0",
    priceNote: "per editor / per month",
    buttonLabel: "Current Plan",
    features: ["Basic access to core features", "Limited usage or access restrictions", "Community support", "Single user access", "Limited storage space", "Access to knowledge base & FAQs"],
    isActive: false,
    isPopular: false,
  },
  {
    id: 2,
    title: "Professional",
    description: "Perfect for Growing business",
    price: "$15",
    priceNote: "per editor / per month",
    buttonLabel: "Upgrade",
    features: ["All Free plan features", "Enhanced collaboration tools", "Increased usage limits", "Priority support", "Early access to new features", "API access with extended limits", "Advanced analytics and reporting",],
    isPopular: true,
    isActive: true,
    popularLabel: "Most Popular",
  },
  {
    id: 3,
    title: "Custom Plan",
    description: "Perfect for Large companies",
    price: "Talk To Us!",
    buttonLabel: "Contact Us",
    features: ["All Team plan features", "Advanced security and compliance options", "Custom integrations and solutions", "Dedicated account manager", "24/7 premium support", "Unlimited storage space", "Priority onboarding assistance", "SLA (Service Level Agreement) Guarantee"],
    isActive: false,
    isPopular: false,
  },
];

export const PricingDescription = "Discover the perfect solution for all your needs with our range of pricing packages designed to exceed your expectations.";

export const FaqNav = [
  { title: "General", type: "general" },
  { title: "Service", type: "service" },
  { title: "Payment", type: "payment" },
  { title: "Vehicles", type: "vehicles" },
  { title: "Refund", type: "refund" },
];

export const FAQAccordionData = [
  {
    type: "general",
    data: [
      {
        id: 1,
        question: "What is the best type of car for me?",
        answer: "The best car for you depends on your needs, such as budget, fuel efficiency, space requirements, and driving conditions. Consider whether you need a sedan, SUV, truck, or electric vehicle.",
      },
      {
        id: 2,
        question: "How often should I get my car serviced?",
        answer: "Regular maintenance typically includes oil changes every 3,000 to 7,500 miles, tire rotations every 6,000 to 8,000 miles, and annual check-ups. Always refer to your car's owner manual for specific recommendations.",
      },
      {
        id: 3,
        question: "What is the difference between leasing and buying a car?",
        answer: "Leasing means paying for the car's depreciation and returning it at the end, while buying means owning the car outright once the loan is paid off. Leasing often has lower monthly payments, but buying is generally more cost-effective in the long run.",
      },
      {
        id: 4,
        question: "How can I improve my car’s fuel efficiency?",
        answer: "Regular maintenance, maintaining proper tire pressure, using high-quality fuel, and driving smoothly can help improve fuel efficiency. Avoiding heavy acceleration and excessive idling also contributes.",
      },
      {
        id: 5,
        question: "What should I check before buying a used car?",
        answer: "Inspect the car’s history report, check for any signs of damage or wear, test drive the vehicle, and have it inspected by a trusted mechanic. Ensure that the vehicle has a clean title and no outstanding recalls.",
      },
      {
        id: 6,
        question: "How can I tell if my car needs new tires?",
        answer: "Check the tread depth using a tread gauge or the penny test (insert a penny into the tread; if you can see the top of Lincoln’s head, it’s time for new tires). Also, look for uneven wear or any bulges and cracks.",
      },
      {
        id: 7,
        question: "How do I choose the right car battery?",
        answer: "Choose a battery with the correct size, type, and specifications for your vehicle as indicated in the owner’s manual. Consider factors like cold-cranking amps (CCA) and reserve capacity (RC) for your driving conditions.",
      },
    ],
  },
  {
    type: "service",
    data: [
      {
        id: 1,
        question: "What should I check before a long road trip?",
        answer: "Before a long trip, check your tire pressure, oil level, coolant, brakes, lights, and windshield wipers. Make sure your spare tire and jack are in good condition. Also, ensure your car's battery is fully charged and that you have a full tank of gas.",
      },
      {
        id: 2,
        question: "How often should I change my oil?",
        answer: "Generally, you should change your oil every 3,000 to 5,000 miles, but it’s best to check your vehicle’s owner’s manual for the manufacturer’s recommendation. Modern cars with synthetic oil can often go up to 7,500 miles between changes.",
      },
      {
        id: 3,
        question: "Why is my car’s check engine light on?",
        answer: "The check engine light can indicate a variety of issues, from a loose gas cap to more serious problems like engine misfires or emissions system failures. It's important to have your car diagnosed by a professional to identify the exact issue.",
      },
      {
        id: 4,
        question: "How can I improve my car’s fuel efficiency?",
        answer: "To improve fuel efficiency, maintain proper tire pressure, avoid aggressive driving, reduce excess weight in the car, use cruise control on highways, and keep up with regular maintenance such as oil changes and air filter replacements.",
      },
      {
        id: 5,
        question: "What should I do if my car overheats?",
        answer: "If your car overheats, pull over safely and turn off the engine. Allow the car to cool before opening the hood. Check the coolant level and top it up if necessary. If the problem persists, contact a tow service to get your car to a mechanic.",
      },
      {
        id: 6,
        question: "What’s the importance of regular brake maintenance?",
        answer: "Regular brake maintenance is crucial for safety. Worn brake pads or other issues can reduce braking efficiency and increase stopping distances, which can lead to accidents. Have your brakes inspected regularly and replace components as needed.",
      },
      {
        id: 7,
        question: "How can I keep my car’s interior clean?",
        answer: "Regularly vacuum and wipe down surfaces with appropriate cleaners. Use seat covers and floor mats to protect the upholstery and carpets. Keep a trash bag in your car to avoid clutter, and clean spills promptly to prevent stains.",
      },
    ],
  },
  {
    type: "payment",
    data: [
      {
        id: 1,
        question: "What is a down payment, and how much should I put down?",
        answer: "A down payment is an upfront payment made when purchasing a car. It reduces the amount you need to finance. It is generally recommended to put down at least 20% of the car's purchase price to reduce monthly payments and interest charges.",
      },
      {
        id: 2,
        question: "How is my monthly car payment calculated?",
        answer: "Your monthly car payment is calculated based on the loan amount, interest rate, and loan term. It also includes any fees and taxes that are financed.",
      },
      {
        id: 3,
        question: "Can I pay off my car loan early?",
        answer: "Yes, you can typically pay off your car loan early. However, some lenders may charge a prepayment penalty. Check your loan agreement for specific terms.",
      },
      {
        id: 4,
        question: "What happens if I miss a car payment?",
        answer: "Missing a car payment can result in late fees, higher interest charges, and potential damage to your credit score. Repeated missed payments can lead to repossession of the vehicle.",
      },
      {
        id: 5,
        question: "What is GAP insurance, and do I need it?",
        answer: "Guaranteed Asset Protection (GAP) insurance covers the difference between the car's value and the amount you owe on the loan if the car is totaled or stolen. It is beneficial if you owe more than the car's current value.",
      },
      {
        id: 6,
        question: "What is a balloon payment?",
        answer: "A balloon payment is a large, lump-sum payment due at the end of a loan term. It is common in some financing arrangements where lower monthly payments are made with a large final payment.",
      },
      {
        id: 7,
        question: "Is leasing cheaper than buying?",
        answer: "Leasing can have lower monthly payments compared to buying because you're only paying for the car's depreciation during the lease term. However, you do not own the car at the end of the lease, which can lead to additional costs if you decide to lease or buy another car.",
      },
    ],
  },
  {
    type: "vehicles",
    data: [
      {
        id: 1,
        question: "What are the key factors to consider when buying a new car?",
        answer: "When buying a car, consider your budget, fuel efficiency, safety features, reliability, and maintenance costs. Match the vehicle to your lifestyle—compact for city driving, SUV for family trips, or truck for heavy-duty tasks. Research resale value, warranty, and financing options to make an informed decision.",
      },
      {
        id: 2,
        question: "What should I do if my car breaks down on the road?",
        answer: "If your car breaks down on the road, the first step is to safely pull over to the side of the road, preferably away from traffic. Turn on your hazard lights to alert other drivers. If possible, place a warning triangle or flares behind your car to increase visibility.",
      },
      {
        id: 3,
        question: "What are the benefits of electric cars compared to traditional gasoline cars?",
        answer: "Electric cars offer several advantages over traditional gasoline cars. They are more environmentally friendly as they produce zero tailpipe emissions, reducing your carbon footprint. Electric vehicles (EVs) also have lower operating costs since electricity is cheaper than gasoline and they require less maintenance due to fewer moving parts.",
      },
      {
        id: 4,
        question: "What are some common car maintenance tasks that I should perform regularly?",
        answer: "Regular car maintenance is crucial to extend the life of your vehicle and ensure your safety on the road. Regular tasks include checking oil levels, tire pressure, and brake pads. You should also replace your air filter, wiper blades, and spark plugs as needed. Don't forget to schedule regular tune-ups and inspections with a trusted mechanic.",
      },
      {
        id: 5,
        question: "What are some common car safety features that I should look for when buying a new car?",
        answer: "When shopping for a new car, look for safety features such as airbags, anti-lock brakes (ABS), electronic stability control (ESC), and a rearview camera. You should also consider features like lane departure warning, blind spot monitoring, and forward collision warning. Additionally, check the car's safety ratings from reputable organizations like the National Highway Traffic Safety Administration (NHTSA) and the Insurance Institute for Highway Safety (IIHS).",
      },
      {
        id: 6,
        question: "What are some common car insurance options that I should consider?",
        answer: "When choosing car insurance, consider options like liability coverage, collision coverage, comprehensive coverage, and personal injury protection (PIP). You should also think about additional features like roadside assistance, rental car coverage, and gap insurance.",
      },
      {
        id: 7,
        question: "What are the signs that my car battery needs to be replaced?",
        answer: "If your car's battery is struggling, you might notice signs like slow engine cranking, dim headlights, or electrical issues such as faulty power windows. A clicking sound when turning the key or a warning light on the dashboard can also indicate battery trouble. If the battery is over three years old, testing it regularly is a good idea.",
      },
    ],
  },
  {
    type: "refund",
    data: [
      {
        id: 1,
        question: "How do I request a refund for my car purchase?",
        answer: "To request a refund for your car purchase, please contact our customer service team within 30 days of your purchase. Include your order number, a brief issue description, and any supporting documents.",
      },
      {
        id: 2,
        question: "What is the refund policy for a car purchase?",
        answer: "Our refund policy allows for returns within 30 days of purchase. The vehicle must be in its original condition with no modifications or damages. Refunds will be processed after a thorough inspection.",
      },
      {
        id: 3,
        question: "Can I get a refund if I’ve used the car?",
        answer: "Refunds are typically only available if the car has not been used. If you have used the car, please contact customer service to discuss potential options, such as a trade-in or exchange.",
      },
      {
        id: 4,
        question: "How long does it take to process a refund?",
        answer: "Refunds are usually processed within 7-10 business days after the return has been inspected and approved. The time may vary depending on your payment method.",
      },
      {
        id: 5,
        question: "Are there any fees associated with a refund?",
        answer: "Depending on the return policy, there may be a restocking fee or other charges. Please review our policy or contact customer service for detailed information about potential fees.",
      },
      {
        id: 6,
        question: "Can I return a car that was purchased as a special order?",
        answer: "Special orders are generally non-refundable. Please refer to the terms provided at the time of purchase or contact our customer service for specific details regarding your order.",
      },
      {
        id: 7,
        question: "What should I do if I receive a defective car?",
        answer: "If you receive a defective car, contact our customer service immediately to report the issue. We will arrange for a return or repair and guide you through the process based on our warranty and return policies.",
      },
      {
        id: 8,
        question: "Can I request a refund for additional services purchased with the car?",
        answer: "Refunds for additional services, such as extended warranties or maintenance plans, are subject to the terms outlined in the service agreement. Please review the agreement or contact customer service for details.",
      },
      {
        id: 9,
        question: "What documents are required for a refund?",
        answer: "Required documents include your original receipt, order confirmation, proof of payment, and any relevant communication or agreements. Contact customer service for a complete list of necessary documentation.",
      },
      {
        id: 10,
        question: "Can I cancel a refund request once it has been submitted?",
        answer: "Yes, you can cancel a refund request as long as the process has not been finalized. Contact our customer service team immediately to withdraw your request.",
      },
      {
        id: 11,
        question: "What happens if I am not eligible for a refund?",
        answer: "If you are not eligible for a refund, we will provide alternative solutions, such as repair services or exchange options, depending on the circumstances. Contact customer service to discuss your case.",
      },
      {
        id: 12,
        question: "Are refunds available for leased cars?",
        answer: "Refunds for leased cars are subject to the terms of the lease agreement. Typically, refunds are not available, but early termination options or adjustments may be offered.",
      },
      {
        id: 13,
        question: "Can I transfer my refund to another purchase?",
        answer: "In some cases, refunds can be applied as a credit towards a new purchase. Please contact customer service to explore this option and review the terms.",
      },
      {
        id: 14,
        question: "Is there a deadline for initiating a refund request?",
        answer: "Refund requests must be initiated within 30 days of the purchase date. Exceptions may apply in specific cases; contact customer service for more information.",
      },
      {
        id: 15,
        question: "What should I do if my refund has not been processed?",
        answer: "If your refund has not been processed within the expected timeframe, contact our customer service team with your refund request details for further assistance.",
      },
    ],
  },
];

export const SidebarItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "listing", label: "My Properties" },
  { id: "property", label: "Create Property" },
  { id: "profile", label: "My Profile" },
  { id: "favorites", label: "Favorites" },
  { id: "privacy", label: "Privacy" },
];

export const SaleData = [
  {
    id: 1,
    name: "Sports Car",
    price: "$31,415",
    trendIcon: "/other/plus-trend.svg",
    trendText: "25% From Last Week",
    mainImage: "/other/user-dashboard/1.svg",
    trendPositive: true,
  },
  {
    id: 2,
    name: "Electric Car",
    price: "$78,812",
    trendIcon: "/other/minus-trend.svg",
    trendText: "-15% From Last Week",
    mainImage: "/other/user-dashboard/2.svg",
    trendPositive: false,
  },
  {
    id: 3,
    name: "Luxury Car",
    price: "$67,810",
    trendIcon: "/other/plus-trend.svg",
    trendText: "36% From Last Week",
    mainImage: "/other/user-dashboard/3.svg",
    trendPositive: true,
    visibleOnLargeScreensOnly: true,
  },
];

export const DealChart: ApexOptions = {
  series: [
    {
      name: "Sell",
      data: [18, 10, 70, 18, 28, 10],
    },
    {
      name: "Rent",
      data: [25, 50, 30, 30, 25, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 250,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ["#FFA941", "var(--chart-theme)"],
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    // tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "outfit, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "outfit, sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1639,
      options: {
        chart: {
          height: 250,
        },
      },
    },
    {
      breakpoint: 1400,
      options: {
        chart: {
          height: 235,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

export const LatestOrderCategories = [
  { id: "sedan", title: "Sedan", imgSrc: "/car/category/1.svg", defaultActive: true },
  { id: "jeep", title: "Jeep", imgSrc: "/car/category/2.svg" },
  { id: "hatchback", title: "Hatchback", imgSrc: "/car/category/4.svg" },
  { id: "convertible", title: "Convertible", imgSrc: "/car/category/7.svg" },
  { id: "suv", title: "SUV", imgSrc: "/car/category/3.svg" },
];

export const TableHead = ["Item", "Modal", "Price"];

export const OrderTabData = [
  {
    id: "sedan",
    label: "Sedan",
    items: [
      {
        id: 1,
        image: "/other/user-dashboard/order/1.jpg",
        title: "Comfortable Interior",
        modal: "Phantom",
        price: "$67,810",
      },
      {
        id: 2,
        image: "/other/user-dashboard/order/2.jpg",
        title: "Smooth Ride",
        modal: "Dawn",
        price: "$55,654",
      },
    ],
  },
  {
    id: "jeep",
    label: "Jeep",
    items: [
      {
        id: 1,
        image: "/other/user-dashboard/order/3.jpg",
        title: "Comfortable Interior",
        modal: "Phantom",
        price: "$67,810",
      },
      {
        id: 2,
        image: "/other/user-dashboard/order/4.jpg",
        title: "Smooth Ride",
        modal: "Dawn",
        price: "$55,654",
      },
    ],
  },
  {
    id: "hatchback",
    label: "Hatchback",
    items: [
      {
        id: 1,
        image: "/other/user-dashboard/order/5.jpg",
        title: "Comfortable Interior",
        modal: "Phantom",
        price: "$67,810",
      },
      {
        id: 2,
        image: "/other/user-dashboard/order/6.jpg",
        title: "Smooth Ride",
        modal: "Dawn",
        price: "$55,654",
      },
    ],
  },
  {
    id: "convertible",
    label: "Convertible",
    items: [
      {
        id: 1,
        image: "/other/user-dashboard/order/7.jpg",
        title: "Comfortable Interior",
        modal: "Phantom",
        price: "$67,810",
      },
      {
        id: 2,
        image: "/other/user-dashboard/order/8.jpg",
        title: "Smooth Ride",
        modal: "Dawn",
        price: "$55,654",
      },
    ],
  },
  {
    id: "suv",
    label: "SUV",
    items: [
      {
        id: 1,
        image: "/other/user-dashboard/order/9.jpg",
        title: "Comfortable Interior",
        modal: "Phantom",
        price: "$67,810",
      },
      {
        id: 2,
        image: "/other/user-dashboard/order/10.jpg",
        title: "Smooth Ride",
        modal: "Dawn",
        price: "$55,654",
      },
    ],
  },
];

export const ModalSwiperSlider = {
  slidesPerView: 3,
  spaceBetween: 15,
  loop: true,
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
      spaceBetween: 15,
    },
  },
};
 
export const WhiteCardData = [1,10,1,6,1]

export const Options_Earning:ApexOptions = {
  series: [
    {
      data: [20, 40, 60, 20, 100, 60, 20, 80, 40, 10, 80, 100, 100],
    },
  ],
  chart: {
    type: "line",
    height: 158,
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 20,
      color: "var(--chart-theme)",
      opacity: 0.5,
    },
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    strokeDashArray: 6,
    position: "back",
    xaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  stroke: {
    curve: "stepline",
    width: 2,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
    min: 0,
    tickAmount: 5,
    
  },
  markers: {
    size: 3,
    colors: "var(--chart-white)",
    strokeColors: "#188aec",
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: "circle",
    offsetX: 2,
    offsetY: 2,  
    hover: {
      size: 3,
    },
  },
  colors: ["#188aec"],

  responsive: [
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 122,
        },
      },
    },
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 160,
        },
      },
    },
  ],
};

export const UserJobSwiper = {
  slidesPerView: 2,
  spaceBetween: 10,
  loop: true,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
  modules: [Autoplay],
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    575: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1200: {
      slidesPerView: 1,
    },
    1460: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
  },
};

export const MyPropertiesHead = ['Id','Property Name','Views','Response','Option']
export const MyProperties = [
  {
    id: 1,
    image: '/property/detail-main/1.jpg',
    title: 'Xatalya Land Residence',
    availableUnits: 25,
    soldUnits: 15,
  },
  {
    id: 2,
    image: '/property/detail-main/2.jpg',
    title: 'Dream Garden Jakarta',
    availableUnits: 45,
    soldUnits: 23,
  },
  {
    id: 3,
    image: '/property/detail-main/3.jpg',
    title: 'Mahogany Neighborhood',
    availableUnits: 58,
    soldUnits: 25,
  },
  {
    id: 4,
    image: '/property/detail-main/1.jpg',
    title: 'Xatalya Land Residence',
    availableUnits: 25,
    soldUnits: 15,
  },
  {
    id: 5,
    image: '/property/detail-main/2.jpg',
    title: 'Dream Garden Jakarta',
    availableUnits: 45,
    soldUnits: 23,
  },
  {
    id: 6,
    image: '/property/detail-main/3.jpg',
    title: 'Mahogany Neighborhood',
    availableUnits: 58,
    soldUnits: 25,
  },
];

export const FurnishingDetailListData = ["Beds", "AC", "Study Table", "Wifi", "Washing Machine", "Fridge", "Cooler", "TV", "Chandelier", "Carpet", "Microwave", "Carpet"];

export const PriceListData = ['PLC','Car Parking','Club Membership'];

export const PersonalInfo = [
  { label: "First Name", value: "Larry" },
  { label: "Last Name", value: "Bishop" },
  { label: "Email Address", value: "LarryMBishop@rhyta.com", isLink: true },
  { label: "Phone No.", value: "773-531-4157", isLink: true },
];

export const AddressInfo = [
  { label: "Country", value: "United Kingdom" },
  { label: "City / State", value: "Leeds, West London" },
  { label: "Postal Code", value: "ERT 2345" },
  { label: "TAX ID", value: "AB57464578" },
];

export const PrivacyData = [
  {
    title: "Privacy",
    btnLabel: "Save Changes",
    switchItem: [
      { title: "Allows others to see my profile", description: "All peoples will be able to see my profile.", checked: true },
      { title: "Who has saved this profile only that people see my profile", description: "All peoples will not be able to see my profile.", checked: false },
    ],
  },
  {
    title: "Account settings",
    btnLabel: "Delete Account",
    switchItem: [
      { title: "Deleting Your Account Will Permanently", description: "Once your account is deleted, you will be logged out and you will need to create a new account.", checked: true },
      { title: "Deleting Your Account Will Temporary", description: "Once your account is deleted, you will be logged out and will be unable to log back in.", checked: false },
    ],
  },
];

export const BottomInfo = [
  { label: "Fuso", isHeader: true },
  { label: "Email :", value: "contact@gmail.com" },
  { label: "Address :", value: "Meester Western" },
  { label: "Phone :", value: "(401) 531-6404" },
];

export const PrivacyNavListData = [
  { id: "privacy-1", title: "Introduction" },
  { id: "privacy-2", title: "Info We Collect" },
  {
    subList: [
      { id: "privacy-2-1", title: "Personal Info" },
      { id: "privacy-2-2", title: "Non-Personal Info" },
    ],
  },
  { id: "privacy-3", title: "Use of Info" },
  { id: "privacy-4", title: "Info Sharing" },
  { id: "privacy-5", title: "Data Security" },
  { id: "privacy-6", title: "Your Rights & Choices" },
  { id: "privacy-7", title: "Cookies & Tracking" },
  { id: "privacy-8", title: "Third-Party Links" },
  { id: "privacy-9", title: "Policy Changes" },
  { id: "privacy-10", title: "Contact Us" },
];

export const PrivacyPolicyData = [
  {
    id: "privacy-1",
    title: "1. Introduction",
    content: "Welcome to Fuso. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website [insert website URL] and use our services related to classified car and job bookings.",
  },
  {
    id: "privacy-2",
    title: "2. Information We Collect",
  },
  {
    id: "privacy-2-1",
    title: "2.1 Personal Information",
    content: "When you use our website, we may collect personal information that you voluntarily provide, including but not limited to:",
    subsections: true,
    subList: [
      { title: "Contact Information : ", content: "Name, email address, phone number, and address." },
      { title: "Booking Information : ", content: "Details about car or job bookings, including preferences, dates, and locations." },
      { title: "Account Information : ", content: "User credentials, including usernames and passwords, if you create an account." },
    ],
  },
  {
    id: "privacy-2-2",
    title: "2.2 Non-Personal Information",
    content: "We also collect non-personal information automatically when you visit our website, such as:",
    subsections: true,
    subList: [
      { title: "Usage Data : ", content: "Information about your interactions with our website, including IP addresses, browser types, and pages viewed." },
      { title: "Cookies and Tracking Technologies : ", content: "We use cookies and similar technologies to enhance your user experience and analyze website traffic." },
    ],
  },
  {
    id: "privacy-3",
    title: "3. How We Use Your Information",
    content: "We use your information for the following purposes:",
    subList: [
      { title: "To Provide Services : ", content: "To process and manage your bookings and provide customer support." },
      { title: "To Improve Our Website : ", content: "To analyze usage patterns and improve website functionality." },
      { title: "To Communicate With You : ", content: "To send updates, notifications, and promotional materials related to our services." },
      { title: "To Comply with Legal Obligations : ", content: "To comply with applicable laws and regulations." },
    ],
  },
  {
    id: "privacy-4",
    title: "4. How We Share Your Information",
    content: "We may share your information with:",
    subList: [
      { title: "Service Providers : ", content: "Third-party vendors who perform services on our behalf, such as payment processors and IT support." },
      { title: "Business Partners : ", content: "Partners who offer related services and may provide you with information relevant to your interests." },
      { title: "Legal Authorities : ", content: "When required by law or to protect our rights and the rights of others." },
    ],
  },
  {
    id: "privacy-5",
    title: "5. Data Security",
    content: "We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no online transmission or storage system is completely secure, so we cannot guarantee absolute security.",
  },
  {
    id: "privacy-6",
    title: "6. Your Rights and Choices",
    content: "You have the following rights regarding your personal information:",
    subList: [
      { title: "Access and Correction : ", content: "You can access and update your personal information through your account or by contacting us." },
      { title: "Opt-Out : ", content: "You may opt out of receiving promotional communications by following the unsubscribe instructions provided in those communications." },
      { title: "Deletion : ", content: "You can request the deletion of your personal information, subject to legal and contractual obligations." },
    ],
  },
  {
    id: "privacy-7",
    title: "7. Cookies and Tracking Technologies",
    content: "We use cookies and similar technologies to collect information about your browsing activities. You can control cookie settings through your browser preferences, but disabling cookies may affect the functionality of our website.",
  },
  {
    id: "privacy-8",
    title: "8. Third-Party Links",
    content: "Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.",
  },
  {
    id: "privacy-9",
    title: "9. Changes to This Privacy Policy",
    content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of our website after changes are made constitutes your acceptance of the revised policy.",
  },
  {
    id: "privacy-10",
    title: "10. Contact Us",
    content: "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:",
  },
];

export const ConditionNavListData = [
  { id: "condition-1", title: "Introduction" },
  { id: "condition-2", title: "Acceptance of Terms" },
  { id: "condition-3", title: "Services Provided" },
  { id: "condition-4", title: "User Responsibilities" },
  {
    subList: [
      { id: "condition-4-1", title: "Account Registration" },
      { id: "condition-4-2", title: "User Conduct" },
    ],
  },
  { id: "condition-5", title: "Content" },
  {
    subList: [
      { id: "condition-5-1", title: "User-Generated Content" },
      { id: "condition-5-2", title: "Content Moderation" },
    ],
  },
  { id: "condition-6", title: "Transactions" },
  {
    subList: [
      { id: "condition-6-1", title: "Listings" },
      { id: "condition-6-2", title: "Payment" },
    ],
  },
  { id: "condition-7", title: "Intellectual Property" },
  { id: "condition-8", title: "Limitation of Liability" },
  { id: "condition-9", title: "Indemnification" },
  { id: "condition-10", title: "Termination" },
  { id: "condition-11", title: "Changes to Terms" },
  { id: "condition-12", title: "Contact Us" },
];

export const ConditionData = [
  {
    id: "condition-1",
    title: "1. Introduction",
    content: "Welcome to Fuso. By accessing or using our website fuso.com and services related to classified car and job bookings, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.",
  },
  {
    id: "condition-2",
    title: "2. Acceptance of Terms",
    content: "By using our Site and Services, you agree to these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these Terms, you should not use our Site or Services",
  },
  {
    id: "condition-3",
    title: "3. Services Provided",
    content: "Fuso provides a platform for users to post and browse classified ads related to car bookings and job opportunities. We do not guarantee the accuracy or completeness of any listings and are not responsible for the transactions or interactions between users.",
  },
  {
    id: "condition-4",
    title: "4. User Responsibilities",
  },
  {
    id: "condition-4-1",
    title: "4.1 Account Registration",
    content: "To use certain features of our Site, you may need to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
    subsections: true,
  },
  {
    id: "condition-4-2",
    title: "4.2 User Conduct",
    content: "You agree to use our Site and Services only for lawful purposes and in accordance with these Terms. You shall not:",
    subsections: true,
    subList: [{ content: "Post any content that is false, misleading, defamatory, or illegal." }, { content: "Use our Site for any fraudulent or unauthorized purpose." }, { content: "Interfere with or disrupt the functioning of our Site or servers." }, { content: "Engage in any activity that could harm or exploit others." }],
  },
  {
    id: "condition-5",
    title: "5. Content",
  },
  {
    id: "condition-5-1",
    title: "5.1 User-Generated Content",
    content: "You retain ownership of any content you post on our Site, but by posting, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with our Services.",
    subsections: true,
  },
  {
    id: "condition-5-2",
    title: "5.2 Content Moderation",
    content: "We reserve the right to remove or modify any content that violates these Terms or is otherwise objectionable at our sole discretion.",
    subsections: true,
  },
  {
    id: "condition-6",
    title: "6. Transactions",
  },
  {
    id: "condition-6-1",
    title: "6.1 Listings",
    content: "Users may post classified ads for cars and job opportunities. All transactions and interactions are solely between the parties involved, and Fuso is not a party to these transactions.",
    subsections: true,
  },
  {
    id: "condition-6-2",
    title: "6.2 Payment",
    content: "Fuso may offer payment processing services for certain transactions. You agree to use any payment methods provided in a lawful manner and comply with any applicable payment terms.",
    subsections: true,
  },
  {
    id: "condition-7",
    title: "7. Intellectual Property",
    content: "All content and materials on our Site, including text, graphics, logos, and software, are the property of Fuso or its licensors and are protected by intellectual property laws. You may not reproduce, distribute, or otherwise use any content from our Site without our express written permission.",
  },
  {
    id: "condition-8",
    title: "8. Limitation of Liability",
    content: "To the maximum extent permitted by law, Fuso and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our Site or Services, including but not limited to loss of data, revenue, or profits.",
  },
  {
    id: "condition-9",
    title: "9. Indemnification",
    content: "You agree to indemnify and hold harmless Fuso and its affiliates from any claims, liabilities, damages, losses, or expenses (including reasonable attorneys' fees) arising out of or in connection with your use of our Site or Services or your violation of these Terms.",
  },
  {
    id: "condition-10",
    title: "10. Termination",
    content: "We reserve the right to suspend or terminate your access to our Site and Services at our sole discretion, without notice, for any reason, including but not limited to violations of these Terms.",
  },
  {
    id: "condition-11",
    title: "11. Changes to Terms",
    content: "We may update these Terms from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of our Site after changes are made constitutes your acceptance of the revised Terms.",
  },
  {
    id: "condition-12",
    title: "12. Contact Us",
    content: "If you have any questions or concerns about these Terms and Conditions, please contact us at:",
  },
];

//Common
export const DarkModeHidden: string[] = ["job-2", "portfolio-detail-2", "portfolio-modern", "portfolio-creative-full", "portfolio-parallax", "login-2", "login-3", "signup-2", "signup-3", "coming-soon"];

//Coming soon
export const SocialLinks: IconLinkList[] = [
  { url: "https://x.com/", icon: "ri-twitter-line" },
  { url: "https://www.facebook.com/", icon: "ri-facebook-circle-line" },
  { url: "https://www.instagram.com/", icon: "ri-instagram-line" },
]