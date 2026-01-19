export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface GalleryEvent {
  id: string;
  title: string;
  description?: string;
  date?: string;
  thumbnail: string;
  images: GalleryImage[];
}

// Placeholder images from portfolio until actual gallery images are added
const getPlaceholderImage = (index: number) => `/assets/images/portfolio/${((index - 1) % 16) + 1}.jpg`;

export const GalleryEvents: GalleryEvent[] = [
  {
    id: "monaco-yacht-show",
    title: "Monaco Yacht Show",
    description: "Annual luxury yacht exhibition in Monaco",
    date: "2024",
    thumbnail: getPlaceholderImage(1),
    images: [
      {
        id: "1",
        src: getPlaceholderImage(1),
        alt: "Monaco Yacht Show 2024",
      },
      {
        id: "2",
        src: getPlaceholderImage(2),
        alt: "Monaco Yacht Show 2024",
      },
      {
        id: "3",
        src: getPlaceholderImage(3),
        alt: "Monaco Yacht Show 2024",
      },
      {
        id: "4",
        src: getPlaceholderImage(4),
        alt: "Monaco Yacht Show 2024",
      },
      {
        id: "5",
        src: getPlaceholderImage(5),
        alt: "Monaco Yacht Show 2024",
      },
      {
        id: "6",
        src: getPlaceholderImage(6),
        alt: "Monaco Yacht Show 2024",
      },
    ],
  },
  {
    id: "cannes-yachting-festival",
    title: "Cannes Yachting Festival",
    description: "Premier yachting event in the French Riviera",
    date: "2024",
    thumbnail: getPlaceholderImage(7),
    images: [
      {
        id: "1",
        src: getPlaceholderImage(7),
        alt: "Cannes Yachting Festival 2024",
      },
      {
        id: "2",
        src: getPlaceholderImage(8),
        alt: "Cannes Yachting Festival 2024",
      },
      {
        id: "3",
        src: getPlaceholderImage(9),
        alt: "Cannes Yachting Festival 2024",
      },
      {
        id: "4",
        src: getPlaceholderImage(10),
        alt: "Cannes Yachting Festival 2024",
      },
    ],
  },
  {
    id: "boat-launching",
    title: "Boat Launching Events",
    description: "Celebrating new yacht launches",
    date: "2024",
    thumbnail: getPlaceholderImage(11),
    images: [
      {
        id: "1",
        src: getPlaceholderImage(11),
        alt: "Boat Launching Event",
      },
      {
        id: "2",
        src: getPlaceholderImage(12),
        alt: "Boat Launching Event",
      },
      {
        id: "3",
        src: getPlaceholderImage(13),
        alt: "Boat Launching Event",
      },
      {
        id: "4",
        src: getPlaceholderImage(14),
        alt: "Boat Launching Event",
      },
      {
        id: "5",
        src: getPlaceholderImage(15),
        alt: "Boat Launching Event",
      },
    ],
  },
  {
    id: "regatta",
    title: "Yacht Regatta",
    description: "Competitive sailing events and races",
    date: "2024",
    thumbnail: getPlaceholderImage(16),
    images: [
      {
        id: "1",
        src: getPlaceholderImage(16),
        alt: "Yacht Regatta",
      },
      {
        id: "2",
        src: getPlaceholderImage(1),
        alt: "Yacht Regatta",
      },
      {
        id: "3",
        src: getPlaceholderImage(2),
        alt: "Yacht Regatta",
      },
      {
        id: "4",
        src: getPlaceholderImage(3),
        alt: "Yacht Regatta",
      },
      {
        id: "5",
        src: getPlaceholderImage(4),
        alt: "Yacht Regatta",
      },
      {
        id: "6",
        src: getPlaceholderImage(5),
        alt: "Yacht Regatta",
      },
    ],
  },
  {
    id: "client-events",
    title: "Client Events",
    description: "Exclusive events for our valued clients",
    date: "2024",
    thumbnail: getPlaceholderImage(6),
    images: [
      {
        id: "1",
        src: getPlaceholderImage(6),
        alt: "Client Event",
      },
      {
        id: "2",
        src: getPlaceholderImage(7),
        alt: "Client Event",
      },
      {
        id: "3",
        src: getPlaceholderImage(8),
        alt: "Client Event",
      },
      {
        id: "4",
        src: getPlaceholderImage(9),
        alt: "Client Event",
      },
    ],
  },
  {
    id: "marina-visits",
    title: "Marina Visits",
    description: "Tours and visits to prestigious marinas",
    date: "2024",
    thumbnail: getPlaceholderImage(10),
    images: [
      {
        id: "1",
        src: getPlaceholderImage(10),
        alt: "Marina Visit",
      },
      {
        id: "2",
        src: getPlaceholderImage(11),
        alt: "Marina Visit",
      },
      {
        id: "3",
        src: getPlaceholderImage(12),
        alt: "Marina Visit",
      },
      {
        id: "4",
        src: getPlaceholderImage(13),
        alt: "Marina Visit",
      },
      {
        id: "5",
        src: getPlaceholderImage(14),
        alt: "Marina Visit",
      },
    ],
  },
];
