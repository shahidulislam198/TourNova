export interface BudgetItem {
  category: string;
  amount: number;
  currency: string;
}

export interface TripDay {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  tips: string;
  budget?: BudgetItem[];
  totalDayBudget?: number;
}

export interface Trip {
  id: string;
  destination: string;
  days: number;
  budget: string;
  interests: string;
  travelers: number;
  plan: TripDay[];
  totalBudget?: number;
  currency?: string;
  createdAt: string;
}
