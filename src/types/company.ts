export interface CompanyMarkup {
  goldBuy: number;
  goldSell: number;
  silverBuy: number;
  silverSell: number;
}

export interface MarkupHistoryEntry {
  id: string;
  goldBuy: number;
  goldSell: number;
  silverBuy: number;
  silverSell: number;
  timestamp: string;
  changedBy: string;
}

export type CompanyStatus = "Active" | "Closed";
export type CooperationType = "Gold" | "Silver" | "Both";

export interface Company {
  id: string;
  name: string;
  taxNumber?: string;
  location?: string;
  createdAt?: string;
  createdById?: string;
  createdByName?: string;
  companyStatus?: CompanyStatus;
  cooperationType?: CooperationType;
  currentMarkup: CompanyMarkup;
  lastUpdated: string;
  markupHistory: MarkupHistoryEntry[];
  imageurl?: string;
}
