export type HostelType = "boys" | "girls" | "co-living";
export type RoomType = "single" | "double" | "triple" | "shared";
export type InquiryStatus = "new" | "contacted" | "visited" | "converted" | "closed";

export type Hostel = {
  id: string;
  slug: string;
  name: string;
  type: HostelType;
  area: string;
  city: string;
  address: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  pricing: {
    roomType: RoomType;
    monthlyFee: number;
    deposit: number;
  }[];
  vacancy: {
    roomType: RoomType;
    available: number;
    total: number;
  }[];
  facilities: string[];
  foodIncluded: boolean;
  foodScore?: number;
  description: string;
  rules: string[];
  contact: {
    phone: string;
    email: string;
  };
};

export type ServiceProvider = {
  id: string;
  name: string;
  phone: string;
  category: string;
  area: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
};

export const NEPAL_CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan"];

export const KATHMANDU_AREAS = [
  "New Baneshwor",
  "Koteshwor",
  "Tinkune",
  "Gaushala",
  "Chabahil",
  "Putalisadak",
  "Dillibazar",
  "Maharajgunj",
  "Baluwatar",
];

export const FACILITIES = [
  "WiFi",
  "Hot Water",
  "Laundry",
  "Study Room",
  "Common Area",
  "CCTV",
  "Warden",
  "Gym",
  "Parking",
  "Purified Water",
  "Power Backup",
  "Recreation Room",
];

export const SERVICE_CATEGORIES = [
  "Plumber",
  "Electrician",
  "Doctor/Clinic",
  "Internet Technician",
  "Cleaner",
  "Carpenter",
  "Painter",
  "Water Supplier",
  "Appliance Repair",
];

export const mockHostels: Hostel[] = [
  {
    id: "1",
    slug: "himalayan-scholars-hostel",
    name: "Himalayan Scholars Hostel",
    type: "boys",
    area: "New Baneshwor",
    city: "Kathmandu",
    address: "Rajeev Marg, New Baneshwor, Kathmandu",
    verified: true,
    rating: 4.6,
    reviewCount: 42,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKx3THXasyoDtQ2ipjfMC9v4v2zcggOcNJuJOqASuI6AfebiXeZTXl-kkeUIe2oJruQeF4pLUuaTUVqMWwVuoh7R596WfU0UmFgBNHh4d1xX-awlf9VjusYo1b19BqYD87DlwjHoDvjLURQq0fXXuyM-KyxMG6GY37jQRkeDPHNOJ-xPK26OYIHZBMAKbqwSDEgKof1p3CqN2GfKXAh02IYm_1HuxOoatXDdmCB0Syy_bkeeH_LVDtSvGVMgjfrYIfumg1k6tfcfM",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1-SY6nYMfJeBhWdWrSuvEenaYBnNOTn7pSSE2aNXoY_lWHLLqbzsCrDH5XcKx1judCfF2YLYFwvAeisxrS_qZtPUpAc3WJ5zwQNWo2dezVnCuZjAAKky0epdQ0Fga3ktgAyLrFeiYNjVBkCvr_7stey_cBNIgbUmd6Tv8SHF_8csJWuHPNAybBXTHcVbnW-LMzfUY-4rzpKNibVH9UuH7fmo_FNVeuK4pxxxhlu4V9QdmFabnlUZbbqqapacY79s2aF-LMAqhFdU",
    ],
    pricing: [
      { roomType: "single", monthlyFee: 12000, deposit: 12000 },
      { roomType: "double", monthlyFee: 8000, deposit: 8000 },
      { roomType: "triple", monthlyFee: 6500, deposit: 6500 },
    ],
    vacancy: [
      { roomType: "single", available: 2, total: 8 },
      { roomType: "double", available: 4, total: 16 },
      { roomType: "triple", available: 0, total: 12 },
    ],
    facilities: [
      "WiFi",
      "Hot Water",
      "Study Room",
      "CCTV",
      "Warden",
      "Power Backup",
      "Purified Water",
    ],
    foodIncluded: true,
    foodScore: 4.3,
    description:
      "Premium hostel for serious students near major colleges. Clean rooms, disciplined environment, and quality food service.",
    rules: [
      "Quiet hours: 10 PM - 6 AM",
      "No guests after 8 PM",
      "Monthly room inspection",
      "No smoking/alcohol",
    ],
    contact: {
      phone: "+977-9801234567",
      email: "info@himalayanscholars.com",
    },
  },
  {
    id: "2",
    slug: "bagmati-boys-hostel",
    name: "Bagmati Boys Hostel",
    type: "boys",
    area: "Koteshwor",
    city: "Kathmandu",
    address: "Koteshwor, Kathmandu",
    verified: true,
    rating: 4.2,
    reviewCount: 28,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1-SY6nYMfJeBhWdWrSuvEenaYBnNOTn7pSSE2aNXoY_lWHLLqbzsCrDH5XcKx1judCfF2YLYFwvAeisxrS_qZtPUpAc3WJ5zwQNWo2dezVnCuZjAAKky0epdQ0Fga3ktgAyLrFeiYNjVBkCvr_7stey_cBNIgbUmd6Tv8SHF_8csJWuHPNAybBXTHcVbnW-LMzfUY-4rzpKNibVH9UuH7fmo_FNVeuK4pxxxhlu4V9QdmFabnlUZbbqqapacY79s2aF-LMAqhFdU",
    ],
    pricing: [
      { roomType: "double", monthlyFee: 6500, deposit: 6500 },
      { roomType: "triple", monthlyFee: 5000, deposit: 5000 },
      { roomType: "shared", monthlyFee: 4000, deposit: 4000 },
    ],
    vacancy: [
      { roomType: "double", available: 3, total: 12 },
      { roomType: "triple", available: 2, total: 10 },
      { roomType: "shared", available: 6, total: 20 },
    ],
    facilities: ["WiFi", "Hot Water", "Laundry", "CCTV", "Warden", "Common Area"],
    foodIncluded: false,
    description:
      "Affordable hostel with basic amenities. Close to Tribhuvan University and major bus routes.",
    rules: [
      "Gate closes at 10 PM",
      "No overnight guests",
      "Keep rooms clean",
      "Respect common areas",
    ],
    contact: {
      phone: "+977-9801234568",
      email: "bagmatiboys@example.com",
    },
  },
  {
    id: "3",
    slug: "lakeside-girls-hostel",
    name: "Lakeside Girls Hostel",
    type: "girls",
    area: "Dillibazar",
    city: "Kathmandu",
    address: "Dillibazar, Kathmandu",
    verified: true,
    rating: 4.8,
    reviewCount: 56,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKx3THXasyoDtQ2ipjfMC9v4v2zcggOcNJuJOqASuI6AfebiXeZTXl-kkeUIe2oJruQeF4pLUuaTUVqMWwVuoh7R596WfU0UmFgBNHh4d1xX-awlf9VjusYo1b19BqYD87DlwjHoDvjLURQq0fXXuyM-KyxMG6GY37jQRkeDPHNOJ-xPK26OYIHZBMAKbqwSDEgKof1p3CqN2GfKXAh02IYm_1HuxOoatXDdmCB0Syy_bkeeH_LVDtSvGVMgjfrYIfumg1k6tfcfM",
    ],
    pricing: [
      { roomType: "single", monthlyFee: 10000, deposit: 10000 },
      { roomType: "double", monthlyFee: 7000, deposit: 7000 },
    ],
    vacancy: [
      { roomType: "single", available: 1, total: 6 },
      { roomType: "double", available: 3, total: 14 },
    ],
    facilities: [
      "WiFi",
      "Hot Water",
      "Study Room",
      "CCTV",
      "Warden",
      "Laundry",
      "Recreation Room",
      "Purified Water",
    ],
    foodIncluded: true,
    foodScore: 4.6,
    description:
      "Safe and comfortable hostel for female students. Experienced female warden, excellent food, and supportive environment.",
    rules: [
      "Quiet hours: 10 PM - 6 AM",
      "Visitors allowed 10 AM - 6 PM only",
      "Strictly for female students",
      "ID required for entry",
    ],
    contact: {
      phone: "+977-9801234569",
      email: "lakesidegirls@example.com",
    },
  },
  {
    id: "4",
    slug: "new-baneshwor-co-living",
    name: "New Baneshwor Co-Living",
    type: "co-living",
    area: "New Baneshwor",
    city: "Kathmandu",
    address: "Near Prisma Complex, New Baneshwor, Kathmandu",
    verified: false,
    rating: 3.9,
    reviewCount: 15,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1-SY6nYMfJeBhWdWrSuvEenaYBnNOTn7pSSE2aNXoY_lWHLLqbzsCrDH5XcKx1judCfF2YLYFwvAeisxrS_qZtPUpAc3WJ5zwQNWo2dezVnCuZjAAKky0epdQ0Fga3ktgAyLrFeiYNjVBkCvr_7stey_cBNIgbUmd6Tv8SHF_8csJWuHPNAybBXTHcVbnW-LMzfUY-4rzpKNibVH9UuH7fmo_FNVeuK4pxxxhlu4V9QdmFabnlUZbbqqapacY79s2aF-LMAqhFdU",
    ],
    pricing: [
      { roomType: "single", monthlyFee: 9000, deposit: 9000 },
      { roomType: "double", monthlyFee: 6000, deposit: 6000 },
    ],
    vacancy: [
      { roomType: "single", available: 4, total: 10 },
      { roomType: "double", available: 6, total: 15 },
    ],
    facilities: ["WiFi", "Hot Water", "Common Area", "CCTV", "Parking"],
    foodIncluded: false,
    description:
      "Modern co-living space for working professionals and students. Flexible rules, individual study spaces.",
    rules: [
      "Mutual respect",
      "Clean common areas",
      "Inform before guests",
      "No loud music after 10 PM",
    ],
    contact: {
      phone: "+977-9801234570",
      email: "newbaneshwor@example.com",
    },
  },
  {
    id: "5",
    slug: "chabahil-student-residence",
    name: "Chabahil Student Residence",
    type: "boys",
    area: "Chabahil",
    city: "Kathmandu",
    address: "Chabahil, Kathmandu",
    verified: true,
    rating: 4.4,
    reviewCount: 34,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKx3THXasyoDtQ2ipjfMC9v4v2zcggOcNJuJOqASuI6AfebiXeZTXl-kkeUIe2oJruQeF4pLUuaTUVqMWwVuoh7R596WfU0UmFgBNHh4d1xX-awlf9VjusYo1b19BqYD87DlwjHoDvjLURQq0fXXuyM-KyxMG6GY37jQRkeDPHNOJ-xPK26OYIHZBMAKbqwSDEgKof1p3CqN2GfKXAh02IYm_1HuxOoatXDdmCB0Syy_bkeeH_LVDtSvGVMgjfrYIfumg1k6tfcfM",
    ],
    pricing: [
      { roomType: "double", monthlyFee: 7500, deposit: 7500 },
      { roomType: "triple", monthlyFee: 6000, deposit: 6000 },
    ],
    vacancy: [
      { roomType: "double", available: 2, total: 10 },
      { roomType: "triple", available: 3, total: 8 },
    ],
    facilities: ["WiFi", "Hot Water", "Study Room", "CCTV", "Gym", "Power Backup"],
    foodIncluded: true,
    foodScore: 4.1,
    description:
      "Well-maintained hostel with gym facility. Near Chabahil Chowk with easy access to public transport.",
    rules: [
      "Entry before 10 PM",
      "No outside food in dining area",
      "Gym timing: 6 AM - 9 PM",
      "Noise discipline",
    ],
    contact: {
      phone: "+977-9801234571",
      email: "chabahil@example.com",
    },
  },
  {
    id: "6",
    slug: "putalisadak-girls-hostel",
    name: "Putalisadak Girls Hostel",
    type: "girls",
    area: "Putalisadak",
    city: "Kathmandu",
    address: "Putalisadak, Kathmandu",
    verified: true,
    rating: 4.5,
    reviewCount: 41,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1-SY6nYMfJeBhWdWrSuvEenaYBnNOTn7pSSE2aNXoY_lWHLLqbzsCrDH5XcKx1judCfF2YLYFwvAeisxrS_qZtPUpAc3WJ5zwQNWo2dezVnCuZjAAKky0epdQ0Fga3ktgAyLrFeiYNjVBkCvr_7stey_cBNIgbUmd6Tv8SHF_8csJWuHPNAybBXTHcVbnW-LMzfUY-4rzpKNibVH9UuH7fmo_FNVeuK4pxxxhlu4V9QdmFabnlUZbbqqapacY79s2aF-LMAqhFdU",
    ],
    pricing: [
      { roomType: "single", monthlyFee: 11000, deposit: 11000 },
      { roomType: "double", monthlyFee: 7500, deposit: 7500 },
      { roomType: "triple", monthlyFee: 6000, deposit: 6000 },
    ],
    vacancy: [
      { roomType: "single", available: 0, total: 4 },
      { roomType: "double", available: 2, total: 12 },
      { roomType: "triple", available: 1, total: 6 },
    ],
    facilities: [
      "WiFi",
      "Hot Water",
      "Study Room",
      "CCTV",
      "Warden",
      "Laundry",
      "Common Area",
      "Purified Water",
    ],
    foodIncluded: true,
    foodScore: 4.4,
    description:
      "Centrally located girls hostel with experienced management. Walking distance to colleges and libraries.",
    rules: [
      "Strict timing: Gate closes 9 PM",
      "Family visitors allowed with prior notice",
      "Weekly room inspection",
      "No pets",
    ],
    contact: {
      phone: "+977-9801234572",
      email: "putalisadak@example.com",
    },
  },
];

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Ram Bahadur Thapa",
    phone: "+977-9841234567",
    category: "Plumber",
    area: "New Baneshwor",
    experience: "8 years of plumbing experience in residential hostels",
    status: "approved",
  },
  {
    id: "2",
    name: "Sita Kumari Sharma",
    phone: "+977-9841234568",
    category: "Cleaner",
    area: "Koteshwor",
    experience: "Professional cleaning service for 5+ years",
    status: "approved",
  },
  {
    id: "3",
    name: "Hari Prasad Adhikari",
    phone: "+977-9841234569",
    category: "Electrician",
    area: "Dillibazar",
    experience: "Licensed electrician with 10 years experience",
    status: "approved",
  },
  {
    id: "4",
    name: "Krishna Internet Services",
    phone: "+977-9841234570",
    category: "Internet Technician",
    area: "Chabahil",
    experience: "Network setup and maintenance for hostels and offices",
    status: "pending",
  },
  {
    id: "5",
    name: "Shiva Carpenter Workshop",
    phone: "+977-9841234571",
    category: "Carpenter",
    area: "Putalisadak",
    experience: "Custom furniture and repair work",
    status: "approved",
  },
];
