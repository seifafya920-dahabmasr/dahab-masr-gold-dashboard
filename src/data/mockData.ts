import { Company } from "@/types/company";
import { User } from "@/types/user";

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Al-Fayed Jewelers",
    // imageurl:
    //   "https://egypt.gold-era.com/wp-content/uploads/2022/09/Gold-Era-logo-gold-.ai-200-x-100-px.png",
    currentMarkup: {
      goldBuy: 2.5,
      goldSell: 3.0,
      silverBuy: 1.5,
      silverSell: 2.0,
    },
    lastUpdated: "2025-01-15T10:30:00Z",
    markupHistory: [
      {
        id: "h1",
        goldBuy: 2.5,
        goldSell: 3.0,
        silverBuy: 1.5,
        silverSell: 2.0,
        timestamp: "2025-01-15T10:30:00Z",
        changedBy: "Ahmed Hassan",
      },
      {
        id: "h2",
        goldBuy: 2.0,
        goldSell: 2.5,
        silverBuy: 1.0,
        silverSell: 1.5,
        timestamp: "2025-01-10T14:20:00Z",
        changedBy: "Mohamed Ali",
      },
      {
        id: "h3",
        goldBuy: 1.8,
        goldSell: 2.2,
        silverBuy: 0.8,
        silverSell: 1.2,
        timestamp: "2025-01-05T09:15:00Z",
        changedBy: "Ahmed Hassan",
      },
    ],
  },
  {
    id: "2",
    name: "Cairo Gold Exchange",
    // imageurl:
    //   "https://egypt.gold-era.com/wp-content/uploads/2022/09/Gold-Era-logo-gold-.ai-200-x-100-px.png",
    currentMarkup: {
      goldBuy: 3.0,
      goldSell: 3.5,
      silverBuy: 2.0,
      silverSell: 2.5,
    },
    lastUpdated: "2025-01-14T16:45:00Z",
    markupHistory: [
      {
        id: "h4",
        goldBuy: 3.0,
        goldSell: 3.5,
        silverBuy: 2.0,
        silverSell: 2.5,
        timestamp: "2025-01-14T16:45:00Z",
        changedBy: "Sara Ahmed",
      },
      {
        id: "h5",
        goldBuy: 2.8,
        goldSell: 3.2,
        silverBuy: 1.8,
        silverSell: 2.2,
        timestamp: "2025-01-08T11:30:00Z",
        changedBy: "Omar Farouk",
      },
    ],
  },
  {
    id: "3",
    name: "Luxor Precious Metals",
    imageurl:
      "https://egypt.gold-era.com/wp-content/uploads/2022/09/Gold-Era-logo-gold-.ai-200-x-100-px.png",
    currentMarkup: {
      goldBuy: 2.0,
      goldSell: 2.5,
      silverBuy: 1.0,
      silverSell: 1.5,
    },
    lastUpdated: "2025-01-13T09:00:00Z",
    markupHistory: [
      {
        id: "h6",
        goldBuy: 2.0,
        goldSell: 2.5,
        silverBuy: 1.0,
        silverSell: 1.5,
        timestamp: "2025-01-13T09:00:00Z",
        changedBy: "Fatima Nasser",
      },
    ],
  },
  {
    id: "4",
    name: "Alexandria Silver Co.",
    imageurl:
      "https://egypt.gold-era.com/wp-content/uploads/2022/09/Gold-Era-logo-gold-.ai-200-x-100-px.png",
    currentMarkup: {
      goldBuy: 2.2,
      goldSell: 2.8,
      silverBuy: 1.8,
      silverSell: 2.3,
    },
    lastUpdated: "2025-01-12T14:30:00Z",
    markupHistory: [
      {
        id: "h7",
        goldBuy: 2.2,
        goldSell: 2.8,
        silverBuy: 1.8,
        silverSell: 2.3,
        timestamp: "2025-01-12T14:30:00Z",
        changedBy: "Youssef Ibrahim",
      },
      {
        id: "h8",
        goldBuy: 2.0,
        goldSell: 2.5,
        silverBuy: 1.5,
        silverSell: 2.0,
        timestamp: "2025-01-07T10:00:00Z",
        changedBy: "Ahmed Hassan",
      },
    ],
  },
  {
    id: "5",
    name: "Giza Gold Trading",
    imageurl:
      "https://egypt.gold-era.com/wp-content/uploads/2022/09/Gold-Era-logo-gold-.ai-200-x-100-px.png",
    currentMarkup: {
      goldBuy: 2.8,
      goldSell: 3.2,
      silverBuy: 1.6,
      silverSell: 2.1,
    },
    lastUpdated: "2025-01-11T11:15:00Z",
    markupHistory: [
      {
        id: "h9",
        goldBuy: 2.8,
        goldSell: 3.2,
        silverBuy: 1.6,
        silverSell: 2.1,
        timestamp: "2025-01-11T11:15:00Z",
        changedBy: "Layla Mahmoud",
      },
    ],
  },
  {
    id: "6",
    name: "Nile Valley Metals",
    imageurl:
      "https://egypt.gold-era.com/wp-content/uploads/2022/09/Gold-Era-logo-gold-.ai-200-x-100-px.png",
    currentMarkup: {
      goldBuy: 2.4,
      goldSell: 2.9,
      silverBuy: 1.4,
      silverSell: 1.9,
    },
    lastUpdated: "2025-01-10T08:45:00Z",
    markupHistory: [
      {
        id: "h10",
        goldBuy: 2.4,
        goldSell: 2.9,
        silverBuy: 1.4,
        silverSell: 1.9,
        timestamp: "2025-01-10T08:45:00Z",
        changedBy: "Hassan Mostafa",
      },
    ],
  },
];

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@dahabmasr.com",
    created_at: "2025-01-01T09:00:00Z",
    createdById: "u1",
    createdByName: "System",
    accountType: "Admin",
    accountStatus: "Active",
  },
  {
    id: "u2",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@dahabmasr.com",
    created_at: "2025-01-05T11:15:00Z",
    createdById: "u1",
    createdByName: "Admin User",
    accountType: "Employee",
    accountStatus: "Active",
  },
  {
    id: "u3",
    name: "Sara Ahmed",
    email: "sara.ahmed@dahabmasr.com",
    created_at: "2025-01-08T14:30:00Z",
    createdById: "u1",
    createdByName: "Admin User",
    accountType: "Employee",
    accountStatus: "Active",
  },
  {
    id: "u4",
    name: "Mohamed Ali",
    email: "mohamed.ali@dahabmasr.com",
    created_at: "2025-01-10T16:45:00Z",
    createdById: "u2",
    createdByName: "Ahmed Hassan",
    accountType: "Employee",
    accountStatus: "Closed",
  },
];
