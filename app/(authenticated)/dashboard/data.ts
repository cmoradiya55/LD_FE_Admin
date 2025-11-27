"use client";

import {
  AlertCircle,
  BusFront,
  Car,
  CarFront,
  CarTaxiFront,
  ClipboardList,
  Clock3,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";

export type CarRentalRow = {
  id: string;
  driver: {
    name: string;
    initials: string;
    location: string;
    avatar?: string;
  };
  car: {
    name: string;
    type: string;
    badge: string;
    accent: string;
  };
  vendor: {
    name: string;
    initials: string;
  };
  start: string;
  finish: string;
  price: string;
  countdown: string;
  status?: "alert" | "ok";
};

export type PendingCarRow = {
  id: string;
  name: string;
  type: string;
  year: number;
  vendor: {
    name: string;
    initials: string;
  };
  minPrice: string;
  maxPrice: string;
  status?: "priority";
};

export const carsOverviewStats = [
  {
    label: "Total cars",
    value: "250",
    icon: Car,
    background: "linear-gradient(135deg, #4b6bfb 0%, #3b82f6 100%)",
    accentCircleColor: "rgba(255,255,255,0.4)",
    valueClassName: "text-2xl md:text-3xl font-semibold tracking-tight",
    labelClassName: "text-xs md:text-sm font-medium",
  },
  {
    label: "Pending cars",
    value: "50",
    icon: Clock3,
    background: "linear-gradient(135deg, #4c60f1 0%, #4851d5 100%)",
    accentCircleColor: "rgba(255,255,255,0.35)",
    valueClassName: "text-2xl md:text-3xl font-semibold tracking-tight",
    labelClassName: "text-xs md:text-sm font-medium",
    labelColor: "rgba(255,255,255,0.85)",
  },
  {
    label: "Active cars",
    value: "200",
    icon: CarFront,
    background: "linear-gradient(135deg, #3f7bf4 0%, #2589f4 100%)",
    accentCircleColor: "rgba(255,255,255,0.35)",
    valueClassName: "text-2xl md:text-3xl font-semibold tracking-tight",
    labelClassName: "text-xs md:text-sm font-medium",
  },
  {
    label: "Cars on rent",
    value: "25",
    icon: CarTaxiFront,
    background: "linear-gradient(135deg, #2f6be5 0%, #2453c7 100%)",
    accentCircleColor: "rgba(255,255,255,0.35)",
    valueClassName: "text-2xl md:text-3xl font-semibold tracking-tight",
    labelClassName: "text-xs md:text-sm font-medium",
  },
  {
    label: "Needs attention",
    value: "59",
    icon: AlertCircle,
    background: "linear-gradient(135deg, #f43f5e 0%, #ef4444 100%)",
    accentCircleColor: "rgba(255,255,255,0.45)",
    valueClassName: "text-2xl md:text-3xl font-semibold tracking-tight",
    labelClassName: "text-xs md:text-sm font-medium",
    labelColor: "#ffe4e6",
    iconBackground: "rgba(255,255,255,0.2)",
  },
];

export const vendorOverviewStats = [
  {
    title: "Total vendors",
    value: "200",
    icon: Users,
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    valueClassName: "text-2xl font-semibold sm:text-3xl",
    titleClassName: "text-sm font-medium",
  },
  {
    title: "Pending vendors",
    value: "8",
    icon: ClipboardList,
    background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
    valueClassName: "text-2xl font-semibold sm:text-3xl",
    titleClassName: "text-sm font-medium",
  },
  {
    title: "Active vendors",
    value: "192",
    icon: UserCheck,
    background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
    valueClassName: "text-2xl font-semibold sm:text-3xl",
    titleClassName: "text-sm font-medium",
  },
];

export const driverOverviewStats = [
  {
    title: "Pending drivers",
    value: "5",
    icon: ClipboardList,
    background: "linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)",
    valueClassName: "text-2xl font-semibold sm:text-3xl",
    titleClassName: "text-sm font-medium",
  },
  {
    title: "Active drivers",
    value: "195",
    icon: UserCog,
    background: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
    valueClassName: "text-2xl font-semibold sm:text-3xl",
    titleClassName: "text-sm font-medium",
  },
  {
    title: "Drivers on rent",
    value: "30",
    icon: BusFront,
    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    valueClassName: "text-2xl font-semibold sm:text-3xl",
    titleClassName: "text-sm font-medium",
  },
];

export const statsData = [
  {
    title: "Total Users",
    value: "12,543",
    icon: Users,
    trend: {
      value: "+2.5%",
      type: "up" as const,
      label: "vs last month",
    },
  },
  {
    title: "Revenue",
    value: "$45,231",
    icon: DollarSign,
    trend: {
      value: "+12.3%",
      type: "up" as const,
      label: "vs last month",
    },
  },
  {
    title: "Orders",
    value: "3,241",
    icon: ShoppingCart,
    trend: {
      value: "-1.2%",
      type: "down" as const,
      label: "vs last month",
    },
  },
  {
    title: "Growth Rate",
    value: "23.1%",
    icon: TrendingUp,
    trend: {
      value: "+4.2%",
      type: "up" as const,
      label: "vs last month",
    },
  },
];

export const recentActivity = [
  {
    id: 1,
    action: "New user registered",
    user: "Sarah Johnson",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    action: "Payment processed",
    user: "Mike Chen",
    time: "5 minutes ago",
    status: "success",
  },
  {
    id: 3,
    action: "Order cancelled",
    user: "Emma Wilson",
    time: "10 minutes ago",
    status: "warning",
  },
  {
    id: 4,
    action: "Support ticket created",
    user: "David Brown",
    time: "15 minutes ago",
    status: "info",
  },
];

export const carsOnRentData: CarRentalRow[] = [
  {
    id: "rent-1",
    driver: {
      name: "Mario James",
      initials: "MJ",
      location: "Lisbon, PT",
    },
    car: {
      name: "Nissan Leaf",
      type: "Electric",
      badge: "EV",
      accent: "from-rose-400 to-rose-500",
    },
    vendor: {
      name: "S.D Exotic",
      initials: "SE",
    },
    start: "09/05/23 09:00",
    finish: "12/05/23 09:00",
    price: "EUR 450",
    countdown: "00:00:00",
    status: "alert",
  },
  {
    id: "rent-2",
    driver: {
      name: "Andrew Wills",
      initials: "AW",
      location: "Madrid, ES",
    },
    car: {
      name: "Kia Niro EV",
      type: "Crossover",
      badge: "EV",
      accent: "from-emerald-400 to-green-500",
    },
    vendor: {
      name: "Car Some",
      initials: "CS",
    },
    start: "09/05/23 08:30",
    finish: "12/05/23 08:30",
    price: "EUR 410",
    countdown: "62:10:01",
  },
  {
    id: "rent-3",
    driver: {
      name: "Iniik James",
      initials: "IJ",
      location: "Rome, IT",
    },
    car: {
      name: "VW ID",
      type: "Hatchback",
      badge: "ID",
      accent: "from-sky-400 to-blue-500",
    },
    vendor: {
      name: "Car Rent",
      initials: "CR",
    },
    start: "09/05/23 08:00",
    finish: "12/05/23 08:00",
    price: "EUR 450",
    countdown: "62:10:01",
  },
  {
    id: "rent-4",
    driver: {
      name: "Maxwell Wright",
      initials: "MW",
      location: "Paris, FR",
    },
    car: {
      name: "Toyota BZX",
      type: "SUV",
      badge: "SUV",
      accent: "from-amber-400 to-orange-500",
    },
    vendor: {
      name: "Auto Hub",
      initials: "AH",
    },
    start: "08/05/23 10:30",
    finish: "12/05/23 10:30",
    price: "EUR 410",
    countdown: "74:10:01",
  },
  {
    id: "rent-5",
    driver: {
      name: "Wills One",
      initials: "WO",
      location: "Berlin, DE",
    },
    car: {
      name: "Kia Niro EV",
      type: "Crossover",
      badge: "EV",
      accent: "from-indigo-400 to-blue-600",
    },
    vendor: {
      name: "Acura",
      initials: "AC",
    },
    start: "08/05/23 08:30",
    finish: "12/05/23 08:30",
    price: "EUR 450",
    countdown: "74:05:01",
  },
  {
    id: "rent-6",
    driver: {
      name: "Red Rock Sunset",
      initials: "RS",
      location: "Los Angeles, US",
    },
    car: {
      name: "Red Rock Sunset",
      type: "SUV",
      badge: "SUV",
      accent: "from-red-400 to-red-500",
    },
    vendor: {
      name: "Red Rock Sunset",
      initials: "RS",
    },
    start: "08/05/23 08:30",
    finish: "12/05/23 08:30",
    price: "USD 450",
    countdown: "74:05:01",
  },
];

export const pendingCarsData: PendingCarRow[] = [
  {
    id: "pending-1",
    name: "Nissan Leaf",
    type: "Hatchback",
    year: 2022,
    vendor: { name: "Acura", initials: "AC" },
    minPrice: "EUR 126.84",
    maxPrice: "EUR 216.14",
  },
  {
    id: "pending-2",
    name: "Toyota Prius",
    type: "Sedan",
    year: 2023,
    vendor: { name: "Red Rock Sunset", initials: "RS" },
    minPrice: "EUR 146.84",
    maxPrice: "EUR 226.84",
    status: "priority",
  },
  {
    id: "pending-3",
    name: "Kia Niro EV",
    type: "Hatchback",
    year: 2022,
    vendor: { name: "Car Some", initials: "CS" },
    minPrice: "EUR 126.84",
    maxPrice: "EUR 216.14",
  },
  {
    id: "pending-4",
    name: "VW ID",
    type: "Hatchback",
    year: 2021,
    vendor: { name: "Auto Rental", initials: "AR" },
    minPrice: "EUR 188.64",
    maxPrice: "EUR 226.84",
  },
  {
    id: "pending-5",
    name: "Kia Niro EV",
    type: "Hatchback",
    year: 2022,
    vendor: { name: "Car Rent HR", initials: "HR" },
    minPrice: "EUR 126.84",
    maxPrice: "EUR 126.84",
  },
  {
    id: "pending-6",
      name: "Red Rock Sunset",
    type: "SUV",
    year: 2022,
      vendor: { name: "Red Rock Sunset", initials: "RS" },
    minPrice: "EUR 126.84",
    maxPrice: "EUR 126.84",
  },
];

export const carBrandLogos: Record<string, string> = {
  nissan: "https://logo.clearbit.com/nissanusa.com",
  toyota: "https://logo.clearbit.com/toyota.com",
  kia: "https://logo.clearbit.com/kia.com",
  vw: "https://logo.clearbit.com/vw.com",
  redrock: "https://logo.clearbit.com/redrock.com",
};

