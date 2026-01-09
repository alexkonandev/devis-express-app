export type QuoteStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "PAID";

export type Profession =
  | "TECH"
  | "CREATIVE"
  | "MARKETING"
  | "CONTENT"
  | "CONSULTING";

export type BusinessModel = "PROJECT" | "TIME" | "RECURRING" | "UNIT";
export interface QuoteItem {
  id: string;
  number: string;
  status: QuoteStatus; // Utilise l'Enum que tu as déjà défini au dessus
  updatedAt: Date;
  totalAmount: number;
  client: {
    name: string;
  };
}

export interface DashboardActivity {
  id: string;
  amount: number;
  status: QuoteStatus;
  clientName: string;
  quoteNumber: string;
  date: Date;
}

export interface TopClient {
  id: string;
  name: string;
  totalSpent: number;
  quoteCount: number;
}

export interface SuggestedService {
  id: string;
  title: string;
  price: number;
  category: string;
}

export interface AdvancedDashboardData {
  kpis: {
    totalRevenue: number;
    pendingRevenue: number;
    conversionRate: number;
    activeQuotes: number;
  };
  activity: DashboardActivity[];
  topClients: TopClient[];
  suggestedServices: SuggestedService[];
}
