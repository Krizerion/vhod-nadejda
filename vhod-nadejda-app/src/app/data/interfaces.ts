export interface Apartment {
  number: number | null;
  debt: number;
  residentsCount?: number;
  repairsFee?: number; // Такса за ремонти (фиксирана €2.50)
  currentExpensesFee?: number; // Такса за текущи разходи (според етажа и брой живущи)
  totalDebt?: number;
  lastPaymentDate?: string;
}

export interface Floor {
  number: number;
  apartments: Apartment[];
}

export interface Announcement {
  id: number;
  message: string;
  date?: string;
  icon: string;
}

export interface AccountBalances {
  currentExpensesBalance: number;
  repairsBalance: number;
}
