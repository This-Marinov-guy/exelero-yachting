import { RouteList } from "@/utils/RouteList";

export const Cities = ["Amsterdam", "Ankara", "Athens", "Atlantic", "Baltimore", "Bangkok", "Beijing", "Berlin", "Berne", "Brussels", "Budapest", "Buenos Aires", "Cairo", "Canberra", "Cannes", "Cape Town", "Chicago", "Cologne", "Copenhagen", "Damascus", "Delhi", "Dubai", "Dublin", "Florence", "Hague", "Havana", "Helsinki", "Hong Kong", "Honolulu", "Istanbul", "Jakarta", "Jerusalem", "Kansas City", "Kathmandu", "Kuala Lumpur", "Lisbon", "London", "Los Angeles", "Luxembourg", "Madrid", "Manila", "Melbourne", "Milan", "Montreal", "Moscow", "Munich", "Nazareth", "New York", "Nice", "Osaka", "Ottawa", "Paris", "Philadelphia", "Phnom Penh", "Prague", "Quito", "Reykjavik", "Rio de Janeiro", "San Francisco", "Santa Fe", "Santiago", "Shanghai", "Singapore City", "Stockholm", "Saint Petersburg", "Seoul", "Sydney", "Taipei", "Toronto", "Venice", "Vienna", "Washington", "Armenia", "Argentina", "Australia", "Aruba", "Belize", "Burundi", "Cape Verde", "Wokha", "Chile", "Ethiopia", "Zunheboto"];

export const HeaderClassMap: { [key: string]: string } = {
  "car-2": " car-top-header",
  job: " job-header",
  "job-2": " dark-job-header",
  "job-3": " job3-header",
  "property-2": " position-relative p-0",
};

export const ContainerClassMap: { [key: string]: string } = {
  "car-2": "car2-header",
  "property-2": "property2-header",
};

export const SearchModalData: { [key: string]: string } = {
  car: "car",
  property: "property",
  "property-2": "property",
  job: "job",
  "job-2": "job",
  "job-3": "job",
};

export const MenuItem = [
  {
    title: "Home",
    type: "sub",
    active: false,
    megaMenuImage: true,
    children: [
      {
        title: "Car Minimal Demo",
        image: "other/menu/1.jpg",
        path: RouteList.Home.CarDemo1,
        type: "link",
      },
      {
        title: "Car Minimal Demo",
        image: "other/menu/2.jpg",
        path: RouteList.Home.CarDemo2,
        type: "link",
      },
      {
        title: "Job Minimal Demo",
        image: "other/menu/3.jpg",
        path: RouteList.Home.JobDemo1,
        type: "link",
      },
      {
        title: "Job Minimal Demo",
        image: "other/menu/5.jpg",
        path: RouteList.Home.JobDemo2,
        type: "link",
      },
      {
        title: "Job Minimal Demo",
        image: "other/menu/4.jpg",
        path: RouteList.Home.JobDemo3,
        type: "link",
      },
      {
        title: "Property Minimal Demo",
        image: "other/menu/6.jpg",
        path: RouteList.Home.PropertyDemo1,
        type: "link",
      },
      {
        title: "Property Minimal Demo",
        image: "other/menu/7.jpg",
        path: RouteList.Home.PropertyDemo2,
        type: "link",
      },
      {
        title: "Coming Soon",
        image: "other/menu/8.jpg",
        type: "link",
      },
    ],
  },
  {
    title: "Property",
    type: "sub",
    active: false,
    children: [
      {
        title: "Grid Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "property 2 grid",
            type: "link",
            path: RouteList.Property.Grid.Property2Grid,
            active: false,
          },
          {
            title: "property 2 right grid",
            type: "sub",
            path: RouteList.Property.Grid.Property2RightGrid,
            active: false,
          },
          {
            title: "property 3 grid",
            type: "sub",
            path: RouteList.Property.Grid.Property3Grid,
            active: false,
          },
          {
            title: "property 3 right grid",
            type: "sub",
            path: RouteList.Property.Grid.Property3RightGrid,
            active: false,
          },
          {
            title: "property 4 grid",
            type: "sub",
            path: RouteList.Property.Grid.Property4Grid,
            active: false,
          },
          {
            title: "property no sidebar",
            type: "sub",
            path: RouteList.Property.Grid.PropertyGridNoSidebar,
            active: false,
          },
        ],
      },
      {
        title: "Listing Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "property left list",
            type: "sub",
            path: RouteList.Property.Listing.PropertyLeftList,
            active: false,
          },
          {
            title: "property right list",
            type: "sub",
            path: RouteList.Property.Listing.PropertyRightList,
            active: false,
          },
          {
            title: "property video list",
            type: "sub",
            path: RouteList.Property.Listing.PropertyVideoList,
            active: false,
          },
          {
            title: "property thumb list",
            type: "sub",
            path: RouteList.Property.Listing.PropertyThumbList,
            active: false,
          },
          {
            title: "property without slider",
            type: "sub",
            path: RouteList.Property.Listing.PropertyWithoutSlider,
            active: false,
          },
        ],
      },
      {
        title: "Other Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "property left drawer",
            type: "sub",
            path: RouteList.Property.Other.PropertyLeftDrawer,
            active: false,
          },
          {
            title: "property right drawer",
            type: "sub",
            path: RouteList.Property.Other.PropertyRightDrawer,
            active: false,
          },
          {
            title: "property infinite scroll",
            type: "sub",
            path: RouteList.Property.Other.PropertyInfiniteScroll,
            active: false,
          },
          {
            title: "property load more",
            type: "sub",
            path: RouteList.Property.Other.PropertyLoadMore,
            active: false,
          },
          {
            title: "property parallax",
            type: "sub",
            path: RouteList.Property.Other.PropertyParallax,
            active: false,
          },
          {
            title: "property grid without slider",
            type: "sub",
            path: RouteList.Property.Other.PropertyGridWithoutSlider,
            active: false,
          },
        ],
      },
      {
        title: "Map Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "property left map",
            type: "sub",
            path: RouteList.Property.Map.MapLeft,
            active: false,
          },
          {
            title: "property right map",
            type: "sub",
            path: RouteList.Property.Map.MapRight,
            active: false,
          },
          {
            title: "property list map",
            type: "sub",
            path: RouteList.Property.Map.MapList,
            active: false,
          },
          {
            title: "property modal map",
            type: "sub",
            path: RouteList.Property.Map.MapModal,
            active: false,
          },
        ],
      },
      {
        title: "Detail Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "property classic",
            type: "sub",
            path: RouteList.Property.Detail.PropertyClassic,
            active: false,
          },
          {
            title: "property scrollspy",
            type: "sub",
            path: RouteList.Property.Detail.PropertyScrollspy,
            active: false,
          },
          {
            title: "property tab",
            type: "sub",
            path: RouteList.Property.Detail.PropertyTab,
            active: false,
          },
          {
            title: "property accordion",
            type: "sub",
            path: RouteList.Property.Detail.PropertyAccordion,
            active: false,
          },
          {
            title: "property image slider",
            type: "sub",
            path: RouteList.Property.Detail.PropertyImageSlider,
            active: false,
          },
          {
            title: "property sticky",
            type: "sub",
            path: RouteList.Property.Detail.PropertySticky,
            active: false,
          },
          {
            title: "property sidebar layout",
            type: "sub",
            path: RouteList.Property.Detail.PropertySidebarLayout,
            active: false,
          },
          {
            title: "property video",
            type: "sub",
            path: RouteList.Property.Detail.PropertyVideo,
            active: false,
          },
          {
            title: "property thumb slider",
            type: "sub",
            path: RouteList.Property.Detail.PropertyThumbSlider,
            active: false,
          },
          {
            title: "property animated icon",
            type: "sub",
            path: RouteList.Property.Detail.PropertyAnimatedIcon,
            active: false,
          },
        ],
      },
      {
        title: "property wishlist",
        type: "sub",
        active: false,
        path: RouteList.Property.PropertyWishlist,
      },
    ],
  },
  {
    title: "Car",
    type: "sub",
    active: false,
    children: [
      {
        title: "Grid Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "Car 2 grid",
            type: "sub",
            path: RouteList.Car.Grid.Car2Grid,
            active: false,
          },
          {
            title: "Car 2 right grid",
            type: "sub",
            path: RouteList.Car.Grid.Car2RightGrid,
            active: false,
          },
          {
            title: "Car 3 grid",
            type: "sub",
            path: RouteList.Car.Grid.Car3Grid,
            active: false,
          },
          {
            title: "Car 3 right grid",
            type: "sub",
            path: RouteList.Car.Grid.Car3RightGrid,
            active: false,
          },
          {
            title: "Car no sidebar",
            type: "sub",
            path: RouteList.Car.Grid.CarNoSidebar,
            active: false,
          },
        ],
      },
      {
        title: "Listing Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "Car left list",
            type: "sub",
            path: RouteList.Car.Listing.CarLeftList,
            active: false,
          },
          {
            title: "Car right list",
            type: "sub",
            path: RouteList.Car.Listing.CarRightList,
            active: false,
          },
        ],
      },
      {
        title: "Other Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "Car left drawer",
            type: "sub",
            path: RouteList.Car.Other.CarLeftDrawer,
            active: false,
          },
          {
            title: "Car right drawer",
            type: "sub",
            path: RouteList.Car.Other.CarRightDrawer,
            active: false,
          },
          {
            title: "Car infinite scroll",
            type: "sub",
            path: RouteList.Car.Other.CarInfiniteScroll,
            active: false,
          },
          {
            title: "Car load more",
            type: "sub",
            path: RouteList.Car.Other.CarLoadMore,
            active: false,
          },
          {
            title: "car top category",
            type: "sub",
            path: RouteList.Car.Other.CarTopCategory,
            active: false,
          },
          {
            title: "car top filter",
            type: "sub",
            path: RouteList.Car.Other.CarTopFilter,
            active: false,
          },
          {
            title: "car without slider",
            type: "sub",
            path: RouteList.Car.Other.CarWithoutSlider,
            active: false,
          },
        ],
      },
      {
        title: "Detail Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "car classic",
            type: "sub",
            path: RouteList.Car.Detail.CarClassic,
            active: false,
          },
          {
            title: "car layout 1",
            type: "sub",
            path: RouteList.Car.Detail.CarLayout1,
            active: false,
          },
          {
            title: "car layout 2",
            type: "sub",
            path: RouteList.Car.Detail.CarLayout2,
            active: false,
          },
          {
            title: "car slider",
            type: "sub",
            path: RouteList.Car.Detail.CarSlider,
            active: false,
          },
          {
            title: "car expand slider",
            type: "sub",
            path: RouteList.Car.Detail.CarExpandSlider,
            active: false,
          },
          {
            title: "car modern slider",
            type: "sub",
            path: RouteList.Car.Detail.CarModernSlider,
            active: false,
          },
          {
            title: "car scrollspy",
            type: "sub",
            path: RouteList.Car.Detail.CarScrollspy,
            active: false,
          },
          {
            title: "car video",
            type: "sub",
            path: RouteList.Car.Detail.CarVideo,
            active: false,
          },
          {
            title: "car classic slider",
            type: "sub",
            path: RouteList.Car.Detail.CarClassicSlider,
            active: false,
          },
          {
            title: "car thumbnail slider",
            type: "sub",
            path: RouteList.Car.Detail.CarThumbnailSlider,
            active: false,
          },
        ],
      },
      {
        title: "car wishlist",
        type: "sub",
        path: RouteList.Car.CarWishlist,
        active: false,
      },
    ],
  },
  {
    title: "Job",
    type: "sub",
    active: false,
    children: [
      {
        title: "Grid Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "job grid progress",
            type: "sub",
            path: RouteList.Job.Grid.JobGridProgress,
            active: false,
          },
          {
            title: "job grid type-2",
            type: "sub",
            path: RouteList.Job.Grid.JobGridType2,
            active: false,
          },
          {
            title: "job grid type 3",
            type: "sub",
            path: RouteList.Job.Grid.JobGridType3,
            active: false,
          },
          {
            title: "job 2 grid",
            type: "sub",
            path: RouteList.Job.Grid.JobGrid2,
            active: false,
          },
          {
            title: "job 2 right grid",
            type: "sub",
            path: RouteList.Job.Grid.Job2RightGrid,
            active: false,
          },
          {
            title: "Job no sidebar",
            type: "sub",
            path: RouteList.Job.Grid.JobGridNoSidebar,
            active: false,
          },
        ],
      },
      {
        title: "Listing Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "Job left list",
            type: "sub",
            path: RouteList.Job.Listing.JobLeftList,
            active: false,
          },
          {
            title: "Job right list",
            type: "sub",
            path: RouteList.Job.Listing.JobRightList,
            active: false,
          },
          {
            title: "Job list no sidebar",
            type: "sub",
            path: RouteList.Job.Listing.JobListNoSidebar,
            active: false,
          },
        ],
      },
      {
        title: "Other Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "Job left drawer",
            type: "sub",
            path: RouteList.Job.Other.jobLeftDrawer,
            active: false,
          },
          {
            title: "Job right drawer",
            type: "sub",
            path: RouteList.Job.Other.jobRightDrawer,
            active: false,
          },
          {
            title: "Job infinite scroll",
            type: "sub",
            path: RouteList.Job.Other.jobInfiniteScroll,
            active: false,
          },
          {
            title: "Job load more",
            type: "sub",
            path: RouteList.Job.Other.jobLoadMore,
            active: false,
          },
          {
            title: "Job ad",
            type: "sub",
            path: RouteList.Job.Other.jobAd,
            active: false,
          },
          {
            title: "Job filter",
            type: "sub",
            path: RouteList.Job.Other.jobFilter,
            active: false,
          },
          {
            title: "job full list",
            type: "sub",
            path: RouteList.Job.Other.jobFullList,
            active: false,
          },
          {
            title: "job both sidebar",
            type: "sub",
            path: RouteList.Job.Other.jobBothSidebar,
            active: false,
          },
          {
            title: "job list style 2",
            type: "sub",
            path: RouteList.Job.Other.jobListStyle2,
            active: false,
          },
        ],
      },
      {
        title: "Detail Pages",
        type: "sub",
        active: false,
        children: [
          {
            title: "job detail 1",
            type: "sub",
            path: RouteList.Job.Detail.JobDetail1,
            active: false,
          },
          {
            title: "job detail 2",
            type: "sub",
            path: RouteList.Job.Detail.JobDetail2,
            active: false,
          },
          {
            title: "job detail 3",
            type: "sub",
            path: RouteList.Job.Detail.JobDetail3,
            active: false,
          },
          {
            title: "job detail 4",
            type: "sub",
            path: RouteList.Job.Detail.JobDetail4,
            active: false,
          },
          {
            title: "job detail 5",
            type: "sub",
            path: RouteList.Job.Detail.JobDetail5,
            active: false,
          },
        ],
      },
      {
        title: "job wishlist",
        type: "sub",
        path: RouteList.Job.JobWishlist,
        active: false,
      },
    ],
  },
  {
    title: "Pages",
    type: "sub",
    active: false,
    megaMenu: true,
    children: [
      {
        section: [
          {
            title: "Blog Pages",
            active: false,
            children: [
              {
                title: "blog left sidebar",
                path: RouteList.Pages.Blog.BlogLeftSidebar,
                type: "link",
              },
              {
                title: "blog right sidebar",
                path: RouteList.Pages.Blog.BlogRightSidebar,
                type: "link",
              },
              {
                title: "blog 2 grid",
                path: RouteList.Pages.Blog.Blog2Grid,
                type: "link",
              },
              {
                title: "blog 2 grid right",
                path: RouteList.Pages.Blog.Blog2GridRight,
                type: "link",
              },
              {
                title: "blog title",
                path: RouteList.Pages.Blog.BlogTitle,
                type: "link",
              },
              {
                title: "blog layout 1",
                path: RouteList.Pages.Blog.BlogLayout1,
                type: "link",
              },
              {
                title: "blog no sidebar",
                path: RouteList.Pages.Blog.BlogNoSidebar,
                type: "link",
              },
              {
                title: "blog top slider",
                path: RouteList.Pages.Blog.BlogToSlider,
                type: "link",
              },
              {
                title: "blog 3 masonry",
                path: RouteList.Pages.Blog.Blog3Masonry,
                type: "link",
              },
              {
                title: "blog load more",
                path: RouteList.Pages.Blog.BlogLoadMore,
                type: "link",
              },
              {
                title: "blog left list",
                path: RouteList.Pages.Blog.BlogLeftList,
                type: "link",
              },
              {
                title: "blog right list",
                path: RouteList.Pages.Blog.BlogRightList,
                type: "link",
              },
              {
                title: "blog infinite scroll",
                path: RouteList.Pages.Blog.BlogInfiniteScroll,
                type: "link",
              },
            ],
          },
        ],
      },
      {
        section: [
          {
            title: "Blog Detail Pages",
            active: false,
            children: [
              {
                title: "blog left classic",
                path: RouteList.Pages.Blog.Detail.BlogLeftClassic,
                type: "link",
              },
              {
                title: "blog right classic",
                path: RouteList.Pages.Blog.Detail.BlogRightClassic,
                type: "link",
              },
              {
                title: "blog video layout",
                path: RouteList.Pages.Blog.Detail.BlogVideoLayout,
                type: "link",
              },
              {
                title: "blog audio layout",
                path: RouteList.Pages.Blog.Detail.BlogAudioLayout,
                type: "link",
              },
              {
                title: "blog slider layout",
                path: RouteList.Pages.Blog.Detail.BlogSliderLayout,
                type: "link",
              },
              {
                title: "blog quote layout",
                path: RouteList.Pages.Blog.Detail.BlogQuoteLayout,
                type: "link",
              },
            ],
          },
          {
            title: "Portfolio Pages",
            active: false,
            children: [
              {
                title: "Portfolio 2 grid",
                path: RouteList.Pages.Portfolio.Portfolio2Grid,
                type: "link",
              },
              {
                title: "Portfolio 3 grid",
                path: RouteList.Pages.Portfolio.Portfolio3Grid,
                type: "link",
              },
              {
                title: "Portfolio 4 grid",
                path: RouteList.Pages.Portfolio.Portfolio4Grid,
                type: "link",
              },
              {
                title: "Portfolio transform",
                path: RouteList.Pages.Portfolio.PortfolioTransform,
                type: "link",
              },
              {
                title: "Portfolio video modal",
                path: RouteList.Pages.Portfolio.PortfolioVideoModal,
                type: "link",
              },
            ],
          },
        ],
      },
      {
        section: [
          {
            title: "Portfolio Pages",
            active: false,
            children: [
              {
                title: "Portfolio gallery icon",
                path: RouteList.Pages.Portfolio.PortfolioGalleryIcon,
                type: "link",
              },
              {
                title: "Portfolio image change",
                path: RouteList.Pages.Portfolio.PortfolioImageChange,
                type: "link",
              },
              {
                title: "Portfolio box slider",
                path: RouteList.Pages.Portfolio.PortfolioBoxSlider,
                type: "link",
              },
              {
                title: "Portfolio parallax",
                path: RouteList.Pages.Portfolio.PortfolioParallax,
                type: "link",
              },
              {
                title: "Portfolio vertical slider",
                path: RouteList.Pages.Portfolio.PortfolioVerticalSlider,
                type: "link",
              },
              {
                title: "Portfolio creative full",
                path: RouteList.Pages.Portfolio.PortfolioCreativeFull,
                type: "link",
              },
              {
                title: "Portfolio modern",
                path: RouteList.Pages.Portfolio.PortfolioModern,
                type: "link",
              },
            ],
          },
          {
            title: "Portfolio Detail Pages",
            active: false,
            children: [
              {
                title: "Portfolio detail 1",
                path: RouteList.Pages.Portfolio.Detail.PortfolioDetail1,
                type: "link",
              },
              {
                title: "Portfolio detail 2",
                path: RouteList.Pages.Portfolio.Detail.PortfolioDetail2,
                type: "link",
              },
            ],
          },
        ],
      },
      {
        section: [
          {
            title: "Other Pages",
            active: false,
            children: [
              {
                title: "About Us 1",
                path: RouteList.Pages.Other.AboutUs1,
                type: "link",
              },
              {
                title: "About Us 2",
                path: RouteList.Pages.Other.AboutUs2,
                type: "link",
              },
              {
                title: "About Us 3",
                path: RouteList.Pages.Other.AboutUs3,
                type: "link",
              },
              {
                title: "contact Us 1",
                path: RouteList.Pages.Other.ContactUs1,
                type: "link",
              },
              {
                title: "contact Us 2",
                path: RouteList.Pages.Other.ContactUs2,
                type: "link",
              },
              {
                title: "contact Us 3",
                path: RouteList.Pages.Other.ContactUs3,
                type: "link",
              },
              {
                title: "Services",
                path: RouteList.Pages.Other.Services,
                type: "link",
              },
              {
                title: "Our Team",
                path: RouteList.Pages.Other.Team,
                type: "link",
              },
              {
                title: "Pricing",
                path: RouteList.Pages.Other.Pricing,
                type: "link",
              },
              {
                title: "Testimonial",
                path: RouteList.Pages.Other.Testimonial,
                type: "link",
              },
              {
                title: "FAQ",
                path: RouteList.Pages.Other.Faq,
                type: "link",
              },
              {
                title: "User Dashboard",
                path: RouteList.Pages.Other.UserDashboard,
                type: "link",
              },
            ],
          },
        ],
      },
      {
        section: [
          {
            title: "Other Pages",
            active: false,
            children: [
              {
                title: "privacy",
                path: RouteList.Pages.Other.Privacy,
                type: "link",
              },
              {
                title: "Terms & Condition",
                path: RouteList.Pages.Other.Condition,
                type: "link",
              },
              {
                title: "404",
                path: RouteList.Pages.Other.Error404,
                type: "link",
              },
              {
                title: "Coming Soon",
                path: RouteList.Pages.Other.ComingSoon,
                type: "link",
              },
              {
                title: "Login 1",
                path: RouteList.Pages.Other.Login1,
                type: "link",
              },
              {
                title: "Login 2",
                path: RouteList.Pages.Other.Login2,
                type: "link",
              },
              {
                title: "Login 3",
                path: RouteList.Pages.Other.Login3,
                type: "link",
              },
              {
                title: "Login 4",
                path: RouteList.Pages.Other.Login4,
                type: "link",
              },
              {
                title: "Signup 1",
                path: RouteList.Pages.Other.SignUp1,
                type: "link",
              },
              {
                title: "Signup 2",
                path: RouteList.Pages.Other.SignUp2,
                type: "link",
              },
              {
                title: "Signup 3",
                path: RouteList.Pages.Other.SignUp3,
                type: "link",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const AccountData = ["All Rides", "My Account", "Saved Rides", "Privacy", "Searches", "Recommendations", "My Profile"];

export const LanguagesData = [
  { data: "en", language: "English" },
  { data: "sp", language: "Spanish" },
  { data: "fr", language: "French" },
  { data: "ge", language: "German" },
  { data: "ko", language: "Korean" },
];

export const SocialLinks = [
  { href: "https://www.facebook.com/", icon: "ri-facebook-fill" },
  { href: "https://x.com/", icon: "ri-twitter-x-line" },
  { href: "https://www.instagram.com/", icon: "ri-instagram-line" },
  { href: "https://www.youtube.com/", icon: "ri-youtube-fill" },
];
