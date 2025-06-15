
import { Category } from '@/types/transaction';

export const categories: Record<'income' | 'expense' | 'investment', Category[]> = {
  income: [
    {
      name: 'Salary',
      subcategories: ['Regular Salary', 'Overtime', 'Bonus', 'Commission']
    },
    {
      name: 'Business',
      subcategories: ['Freelance', 'Consulting', 'Sales', 'Services']
    },
    {
      name: 'Investments',
      subcategories: ['Dividends', 'Interest', 'Capital Gains', 'Rental Income']
    },
    {
      name: 'Other',
      subcategories: ['Gifts', 'Refunds', 'Government Benefits', 'Side Hustle']
    }
  ],
  expense: [
    {
      name: 'Housing',
      subcategories: ['Rent', 'Mortgage', 'Property Tax', 'Home Insurance', 'Utilities', 'Maintenance']
    },
    {
      name: 'Transportation',
      subcategories: ['Car Payment', 'Gas', 'Insurance', 'Maintenance', 'Public Transit', 'Parking']
    },
    {
      name: 'Food',
      subcategories: ['Groceries', 'Restaurants', 'Fast Food', 'Coffee', 'Delivery']
    },
    {
      name: 'Healthcare',
      subcategories: ['Insurance', 'Doctor Visits', 'Medications', 'Dental', 'Vision']
    },
    {
      name: 'Entertainment',
      subcategories: ['Movies', 'Concerts', 'Gaming', 'Hobbies', 'Subscriptions']
    },
    {
      name: 'Shopping',
      subcategories: ['Clothing', 'Electronics', 'Home Goods', 'Personal Care', 'Gifts']
    },
    {
      name: 'Education',
      subcategories: ['Tuition', 'Books', 'Courses', 'Training', 'Certification']
    },
    {
      name: 'Other',
      subcategories: ['Bank Fees', 'Professional Services', 'Donations', 'Miscellaneous']
    }
  ],
  investment: [
    {
      name: 'Stocks',
      subcategories: ['Individual Stocks', 'ETFs', 'Mutual Funds', 'Index Funds']
    },
    {
      name: 'Bonds',
      subcategories: ['Government Bonds', 'Corporate Bonds', 'Municipal Bonds']
    },
    {
      name: 'Real Estate',
      subcategories: ['REIT', 'Rental Property', 'Real Estate Crowdfunding']
    },
    {
      name: 'Retirement',
      subcategories: ['401k', 'IRA', 'Roth IRA', 'Pension']
    },
    {
      name: 'Alternative',
      subcategories: ['Cryptocurrency', 'Commodities', 'Collectibles', 'Business Investment']
    }
  ]
};
