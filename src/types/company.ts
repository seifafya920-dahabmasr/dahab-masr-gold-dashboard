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

export interface Company {
  id: string;
  name: string;
  currentMarkup: CompanyMarkup;
  lastUpdated: string;
  markupHistory: MarkupHistoryEntry[];
}
