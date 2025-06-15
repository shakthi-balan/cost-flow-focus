
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Download, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import TransactionsList from './TransactionsList';
import FinancialCharts from './FinancialCharts';
import { exportToCSV } from '@/utils/exportUtils';
import { mockTransactions } from '@/data/mockData';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [dateRange, setDateRange] = useState('this-month');

  // Calculate summary statistics
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalInvestments = mockTransactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netWorth = totalIncome - totalExpenses - totalInvestments;

  const handleExport = () => {
    exportToCSV(mockTransactions, 'expense-tracker-data.csv');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">$</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
              <p className="text-sm text-gray-600">Financial Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Summary Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Investments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalInvestments.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${netWorth >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-orange-500 to-orange-600'} text-white border-0`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${netWorth.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions List */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Transactions
                  <Badge variant="secondary">{mockTransactions.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TransactionsList transactions={mockTransactions} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Charts and Analytics */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Financial Overview
                  </span>
                  <div className="flex space-x-2">
                    {['this-month', 'last-3-months', 'this-year'].map((range) => (
                      <Button
                        key={range}
                        variant={dateRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDateRange(range)}
                        className="text-xs"
                      >
                        {range === 'this-month' ? 'This Month' : 
                         range === 'last-3-months' ? 'Last 3M' : 'This Year'}
                      </Button>
                    ))}
                  </div>
                </CardTitle>
                <CardDescription>
                  Analyze your spending patterns and financial trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialCharts transactions={mockTransactions} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
