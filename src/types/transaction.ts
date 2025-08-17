
// Transaction interface matching database schema
export interface Transaction {
  id: string; // UUID from database
  type: 'income' | 'expense'; // Simplified to match database constraint
  amount: number; // Monetary value
  description: string; // User description
  category: string; // Transaction category
  subcategory?: string; // Optional subcategory
  account?: string; // Optional account field for compatibility
  note?: string; // Optional additional notes
  date: string; // Date string in YYYY-MM-DD format
  created_at?: string; // Auto-generated timestamp
  updated_at?: string; // Auto-updated timestamp
  user_id?: string; // User ID for database operations
}

export interface Category {
  name: string;
  subcategories: string[];
}

// Summary interface for financial calculations
export interface TransactionSummary {
  totalIncome: number; // Total income for selected period
  totalExpenses: number; // Total expenses for selected period
  totalInvestments: number; // Total investments (kept for compatibility)
  netWorth: number; // Calculated net position
  monthlyData: MonthlyData[]; // Time series data for charts
  categoryBreakdown: CategoryBreakdown[]; // Category analysis
}

// Monthly aggregated data for charts and analysis
export interface MonthlyData {
  month: string; // Month identifier (YYYY-MM format)
  income: number; // Total income for the month
  expenses: number; // Total expenses for the month
  investments: number; // Total investments for the month (compatibility)
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}
