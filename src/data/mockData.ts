
import { Transaction } from '@/types/transaction';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    description: 'Monthly Salary',
    category: 'Salary',
    subcategory: 'Regular Salary',
    account: 'checking',
    date: '2024-01-15',
    note: 'January salary payment'
  },
  {
    id: '2',
    type: 'expense',
    amount: 1200,
    description: 'Monthly Rent',
    category: 'Housing',
    subcategory: 'Rent',
    account: 'checking',
    date: '2024-01-01'
  },
  {
    id: '3',
    type: 'expense',
    amount: 300,
    description: 'Grocery Shopping',
    category: 'Food',
    subcategory: 'Groceries',
    account: 'credit-card',
    date: '2024-01-10'
  },
  {
    id: '4',
    type: 'expense',
    amount: 1000,
    description: 'S&P 500 ETF',
    category: 'Savings',
    subcategory: 'ETFs',
    account: 'investment',
    date: '2024-01-20'
  },
  {
    id: '5',
    type: 'expense',
    amount: 80,
    description: 'Gas Station',
    category: 'Transportation',
    subcategory: 'Gas',
    account: 'credit-card',
    date: '2024-01-12'
  },
  {
    id: '6',
    type: 'income',
    amount: 500,
    description: 'Freelance Project',
    category: 'Business',
    subcategory: 'Freelance',
    account: 'checking',
    date: '2024-01-25'
  },
  {
    id: '7',
    type: 'expense',
    amount: 150,
    description: 'Internet & Phone',
    category: 'Housing',
    subcategory: 'Utilities',
    account: 'checking',
    date: '2024-01-05'
  },
  {
    id: '8',
    type: 'expense',
    amount: 45,
    description: 'Restaurant Dinner',
    category: 'Food',
    subcategory: 'Restaurants',
    account: 'credit-card',
    date: '2024-01-18'
  },
  {
    id: '9',
    type: 'expense',
    amount: 500,
    description: '401k Contribution',
    category: 'Savings',
    subcategory: '401k',
    account: 'investment',
    date: '2024-01-15'
  },
  {
    id: '10',
    type: 'expense',
    amount: 25,
    description: 'Coffee & Snacks',
    category: 'Food',
    subcategory: 'Coffee',
    account: 'cash',
    date: '2024-01-22'
  }
];
