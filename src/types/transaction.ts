
export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'investment';
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  account: string;
  note?: string;
  date: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface Category {
  name: string;
  subcategories: string[];
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  netWorth: number;
  monthlyData: MonthlyData[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  investments: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}
