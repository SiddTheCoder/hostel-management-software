export type Tone =
  | "admin"
  | "danger"
  | "guardian"
  | "platform"
  | "resident"
  | "slate"
  | "success"
  | "teal"
  | "warning";

export type HostelSummary = {
  id: string;
  slug: string;
  name: string;
  owner: string;
  area: string;
  city: string;
  address: string;
  image: string;
  type: "boys" | "girls" | "co-living";
  verified: boolean;
  status: "pending" | "approved" | "published" | "under review";
  rating: number;
  reviews: number;
  price: number;
  vacancy: number;
  roomTypes: string[];
  facilities: string[];
  foodScore: number;
  description: string;
};

export type ResidentRecord = {
  id: string;
  name: string;
  avatar: string;
  room: string;
  bed: string;
  guardian: string;
  guardianPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  feeStatus: "paid" | "pending" | "overdue";
  nightStatus: "inside hostel" | "outside hostel";
  activationStatus: "activated" | "not generated";
  joinedOn: string;
};

export type PaymentRecord = {
  id: string;
  resident: string;
  month: string;
  amount: string;
  method: string;
  status: "paid" | "pending" | "partial" | "overdue" | "due soon";
  date: string;
};

export type NoticeRecord = {
  id: string;
  title: string;
  category: string;
  date: string;
  visibility: string;
  status: "published" | "draft" | "unread" | "read";
  detail: string;
};

export type ProviderRecord = {
  id: string;
  name: string;
  category: string;
  area: string;
  phone: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  availability: string;
};

export type MenuMeal = {
  id: string;
  meal: string;
  time: string;
  items: string;
  image: string;
  rating: number;
};

export const imageSet = {
  exteriorA:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBKx3THXasyoDtQ2ipjfMC9v4v2zcggOcNJuJOqASuI6AfebiXeZTXl-kkeUIe2oJruQeF4pLUuaTUVqMWwVuoh7R596WfU0UmFgBNHh4d1xX-awlf9VjusYo1b19BqYD87DlwjHoDvjLURQq0fXXuyM-KyxMG6GY37jQRkeDPHNOJ-xPK26OYIHZBMAKbqwSDEgKof1p3CqN2GfKXAh02IYm_1HuxOoatXDdmCB0Syy_bkeeH_LVDtSvGVMgjfrYIfumg1k6tfcfM",
  exteriorB:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD1-SY6nYMfJeBhWdWrSuvEenaYBnNOTn7pSSE2aNXoY_lWHLLqbzsCrDH5XcKx1judCfF2YLYFwvAeisxrS_qZtPUpAc3WJ5zwQNWo2dezVnCuZjAAKky0epdQ0Fga3ktgAyLrFeiYNjVBkCvr_7stey_cBNIgbUmd6Tv8SHF_8csJWuHPNAybBXTHcVbnW-LMzfUY-4rzpKNibVH9UuH7fmo_FNVeuK4pxxxhlu4V9QdmFabnlUZbbqqapacY79s2aF-LMAqhFdU",
  lobby:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAD0NmbtkszFG87IhrLCwa2eHWDmk4NxOgpfoid2_zjZOx8uWA_hMcSeKmVOMRSjh6cGCyLc1Z9nGlZcL0Ki792qNxyaYBty13f2J3WQOuXIX_srJKrKQdS6r3NM_RDpDB3vErb3M4AXliIEEDa0efsPzIkws2iSLR5sBqDWjn4m6sUtt9ldLyN6Qa-ajl1zvazFY7UZ_2dAjeEU277a2C041A_ZzYl0_2dfHrJqKF0tb0-ivW1NlN_H88HwOtS1kTCG90Xs6WE0dc",
  room:
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
  foodA:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  foodB:
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
  foodC:
    "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=900&q=80",
  portraitA:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  portraitB:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
};

export const hostelListings: HostelSummary[] = [
  {
    id: "hst_001",
    slug: "green-view-hostel",
    name: "Green View Hostel",
    owner: "Aarav Shrestha",
    area: "Bagdol",
    city: "Lalitpur",
    address: "Bagdol, Lalitpur, Kathmandu Valley",
    image: imageSet.exteriorA,
    type: "co-living",
    verified: true,
    status: "pending",
    rating: 4.6,
    reviews: 120,
    price: 9600,
    vacancy: 12,
    roomTypes: ["Single", "Double", "Triple"],
    facilities: ["Wi-Fi", "Food", "Study Room", "CCTV", "Hot Water"],
    foodScore: 4.4,
    description:
      "A verified student-focused hostel with clean rooms, responsible wardens, monthly dues tracking, and transparent food service.",
  },
  {
    id: "hst_002",
    slug: "sunrise-boys-hostel",
    name: "Sunrise Boys Hostel",
    owner: "Pema Sherpa",
    area: "Koteshwor",
    city: "Kathmandu",
    address: "Koteshwor, Kathmandu",
    image: imageSet.exteriorB,
    type: "boys",
    verified: true,
    status: "published",
    rating: 4.4,
    reviews: 98,
    price: 8500,
    vacancy: 8,
    roomTypes: ["Double", "Dormitory"],
    facilities: ["Wi-Fi", "Food", "Laundry", "Warden"],
    foodScore: 4.1,
    description:
      "Affordable boys hostel close to major bus routes with reliable meal plans and simple room assignments.",
  },
  {
    id: "hst_003",
    slug: "himalaya-girls-hostel",
    name: "Himalaya Girls Hostel",
    owner: "Nisha Gurung",
    area: "Lakeside",
    city: "Pokhara",
    address: "Lakeside, Pokhara, Kaski",
    image: imageSet.exteriorA,
    type: "girls",
    verified: true,
    status: "under review",
    rating: 4.7,
    reviews: 156,
    price: 10500,
    vacancy: 15,
    roomTypes: ["Single", "Double"],
    facilities: ["Wi-Fi", "Food", "Female Warden", "CCTV", "Study Room"],
    foodScore: 4.6,
    description:
      "A calm girls hostel with strict safety processes, guardian summaries, and verified resident review controls.",
  },
  {
    id: "hst_004",
    slug: "peace-co-living",
    name: "Peace Co-living",
    owner: "Rohan Karki",
    area: "Bhaisepati",
    city: "Kathmandu",
    address: "Bhaisepati, Kathmandu",
    image: imageSet.lobby,
    type: "co-living",
    verified: true,
    status: "published",
    rating: 4.5,
    reviews: 88,
    price: 12000,
    vacancy: 6,
    roomTypes: ["Single", "Double"],
    facilities: ["Wi-Fi", "Kitchen", "Parking", "Power Backup"],
    foodScore: 4.2,
    description:
      "Premium co-living for students and young professionals with flexible stay options and private-room inventory.",
  },
  {
    id: "hst_005",
    slug: "university-view-hostel",
    name: "University View Hostel",
    owner: "Binod Adhikari",
    area: "Kirtipur",
    city: "Kathmandu",
    address: "Kirtipur, Kathmandu",
    image: imageSet.exteriorB,
    type: "boys",
    verified: true,
    status: "published",
    rating: 4.3,
    reviews: 74,
    price: 7500,
    vacancy: 10,
    roomTypes: ["Double", "Triple", "Dormitory"],
    facilities: ["Wi-Fi", "Food", "Library", "Common Room"],
    foodScore: 4,
    description:
      "Student hostel near campus with affordable rooms, published notices, and transparent monthly fee receipts.",
  },
];

export const residents: ResidentRecord[] = [
  {
    id: "res_001",
    name: "Aarav Shrestha",
    avatar: imageSet.portraitA,
    room: "101",
    bed: "Bed A",
    guardian: "Bikash Shrestha",
    guardianPhone: "9861234567",
    emergencyContact: "Sita Shrestha",
    emergencyPhone: "9841234567",
    feeStatus: "paid",
    nightStatus: "inside hostel",
    activationStatus: "activated",
    joinedOn: "15 Jan 2025",
  },
  {
    id: "res_002",
    name: "Ritesh Kumar",
    avatar: imageSet.portraitA,
    room: "201",
    bed: "Bed B",
    guardian: "Mahesh Kumar",
    guardianPhone: "9851122334",
    emergencyContact: "Sunita Kumar",
    emergencyPhone: "9813344556",
    feeStatus: "paid",
    nightStatus: "inside hostel",
    activationStatus: "activated",
    joinedOn: "15 Jan 2025",
  },
  {
    id: "res_003",
    name: "Sujan Acharya",
    avatar: imageSet.portraitA,
    room: "103",
    bed: "Bed A",
    guardian: "Krishna Acharya",
    guardianPhone: "9845678901",
    emergencyContact: "Rita Acharya",
    emergencyPhone: "9856789012",
    feeStatus: "pending",
    nightStatus: "outside hostel",
    activationStatus: "not generated",
    joinedOn: "02 Feb 2025",
  },
  {
    id: "res_004",
    name: "Niraj Kandel",
    avatar: imageSet.portraitA,
    room: "402",
    bed: "Bed C",
    guardian: "Hari Kandel",
    guardianPhone: "9809988776",
    emergencyContact: "Laxmi Kandel",
    emergencyPhone: "9818877665",
    feeStatus: "paid",
    nightStatus: "inside hostel",
    activationStatus: "activated",
    joinedOn: "12 Mar 2025",
  },
  {
    id: "res_005",
    name: "Anjali Thapa",
    avatar: imageSet.portraitB,
    room: "102",
    bed: "Bed B",
    guardian: "Dinesh Thapa",
    guardianPhone: "9842233445",
    emergencyContact: "Maya Thapa",
    emergencyPhone: "9853322110",
    feeStatus: "overdue",
    nightStatus: "outside hostel",
    activationStatus: "not generated",
    joinedOn: "09 Apr 2025",
  },
  {
    id: "res_006",
    name: "Pratik Ghimire",
    avatar: imageSet.portraitA,
    room: "301",
    bed: "Bed A",
    guardian: "Deepak Ghimire",
    guardianPhone: "9856677889",
    emergencyContact: "Saraswati Ghimire",
    emergencyPhone: "9846677889",
    feeStatus: "paid",
    nightStatus: "inside hostel",
    activationStatus: "activated",
    joinedOn: "18 May 2025",
  },
];

export const payments: PaymentRecord[] = [
  {
    id: "pay_001",
    resident: "Aarav Shrestha",
    month: "Jun 2026 Fee",
    amount: "NPR 8,500",
    method: "eSewa",
    status: "overdue",
    date: "Jun 10, 2026",
  },
  {
    id: "pay_002",
    resident: "Ritesh Kumar",
    month: "May 2026 Fee",
    amount: "NPR 8,500",
    method: "Fonepay",
    status: "paid",
    date: "May 20, 2026",
  },
  {
    id: "pay_003",
    resident: "Sujan Acharya",
    month: "May 2026 Fee",
    amount: "NPR 5,000",
    method: "Khalti",
    status: "partial",
    date: "May 19, 2026",
  },
  {
    id: "pay_004",
    resident: "Anjali Thapa",
    month: "Apr 2026 Fee",
    amount: "NPR 8,500",
    method: "Bank Transfer",
    status: "pending",
    date: "Apr 28, 2026",
  },
  {
    id: "pay_005",
    resident: "Niraj Kandel",
    month: "Subscription Renewal",
    amount: "NPR 25,000",
    method: "Cash",
    status: "due soon",
    date: "Jun 20, 2026",
  },
];

export const notices: NoticeRecord[] = [
  {
    id: "not_001",
    title: "Water Supply Interruption",
    category: "Maintenance",
    date: "Today",
    visibility: "Residents and guardians",
    status: "unread",
    detail:
      "Water supply will be interrupted on May 22 from 10:00 AM to 2:00 PM due to maintenance work.",
  },
  {
    id: "not_002",
    title: "June Fee Due Reminder",
    category: "Payment",
    date: "Yesterday",
    visibility: "Residents and guardians",
    status: "published",
    detail:
      "June monthly fee is due on 25th June 2026. Please make the payment on time.",
  },
  {
    id: "not_003",
    title: "Wi-Fi Maintenance",
    category: "Internet",
    date: "May 19",
    visibility: "Residents",
    status: "published",
    detail:
      "Wi-Fi may be unstable on May 23 from 8:00 PM to 11:00 PM due to network maintenance.",
  },
  {
    id: "not_004",
    title: "Guest Visit Policy Update",
    category: "Rules",
    date: "May 18",
    visibility: "Residents",
    status: "draft",
    detail: "New guest visit policy is effective from May 20. Please check details.",
  },
];

export const weeklyMenu: MenuMeal[] = [
  {
    id: "meal_001",
    meal: "Breakfast",
    time: "7:30 AM - 9:30 AM",
    items: "Poha, boiled egg, tea",
    image: imageSet.foodA,
    rating: 4.4,
  },
  {
    id: "meal_002",
    meal: "Lunch",
    time: "12:00 PM - 2:00 PM",
    items: "Dal, rice, chicken curry, vegetable, salad",
    image: imageSet.foodB,
    rating: 4.2,
  },
  {
    id: "meal_003",
    meal: "Dinner",
    time: "7:00 PM - 8:30 PM",
    items: "Chicken curry, rice, roti, pickle",
    image: imageSet.foodC,
    rating: 4.5,
  },
];

export const providers: ProviderRecord[] = [
  {
    id: "srv_001",
    name: "CleanStay Nepal",
    category: "Cleaner",
    area: "Lalitpur",
    phone: "9841002300",
    rating: 4.8,
    status: "approved",
    availability: "Weekdays",
  },
  {
    id: "srv_002",
    name: "Karki Electric Works",
    category: "Electrician",
    area: "Koteshwor",
    phone: "9841002301",
    rating: 4.6,
    status: "approved",
    availability: "24/7 emergency",
  },
  {
    id: "srv_003",
    name: "Bishal Plumbing",
    category: "Plumber",
    area: "New Baneshwor",
    phone: "9841002302",
    rating: 4.5,
    status: "pending",
    availability: "Morning",
  },
  {
    id: "srv_004",
    name: "City Clinic Network",
    category: "Doctor/Clinic",
    area: "Kathmandu",
    phone: "9841002303",
    rating: 4.7,
    status: "approved",
    availability: "On call",
  },
];

export const complaints = [
  {
    id: "cmp_001",
    title: "Water filter inspection due",
    resident: "Aarav Shrestha",
    priority: "high",
    status: "open",
    sla: "04h 20m",
  },
  {
    id: "cmp_002",
    title: "Room fan repair request",
    resident: "Anonymous",
    priority: "medium",
    status: "in progress",
    sla: "18h 10m",
  },
  {
    id: "cmp_003",
    title: "Food quality feedback",
    resident: "Ritesh Kumar",
    priority: "low",
    status: "resolved",
    sla: "closed",
  },
];

export const auditActivity = [
  "Hostel Green View Hostel approved by Suman Thapa",
  "New owner Nisha Gurung registered from Pokhara",
  "Payment of NPR 25,000 received from Peace Co-living",
  "Abuse flag reported for listing ID HST-1298",
  "Service provider CleanStay Nepal updated profile information",
];

export const platformMetrics = [
  ["Total Hostels", "1,248", "8.5% vs last month", "platform"],
  ["Pending Approvals", "37", "12 require review", "warning"],
  ["Active Residents", "18,742", "6.3% vs last month", "success"],
  ["Inquiries", "2,356", "14.2% vs last month", "platform"],
  ["Service Providers", "312", "5.7% vs last month", "platform"],
  ["Complaints", "89", "4.1% vs last month", "danger"],
  ["Platform Revenue", "NPR 2,845,760", "16.8% vs last month", "success"],
] as const;

export const adminMetrics = [
  ["Residents", "128", "118 active this month", "admin"],
  ["Vacant Beds", "12", "Out of 140 beds", "success"],
  ["Monthly Dues", "NPR 1.2L", "8 residents overdue", "warning"],
  ["Payment Proofs", "14", "Pending approval", "admin"],
  ["Complaints", "3", "2 high priority", "danger"],
  ["Maintenance", "7", "Open requests", "warning"],
  ["Food Feedback", "4.4", "Average rating", "success"],
  ["Night Status", "98 inside", "10 outside hostel", "admin"],
] as const;
