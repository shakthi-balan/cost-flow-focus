
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Download, Calendar, TrendingUp, TrendingDown, DollarSign, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import TransactionsList from './TransactionsList';
import FinancialCharts from './FinancialCharts';
import DateRangeSelector from './DateRangeSelector';
import AISummarySection from './AISummarySection';
import FinanceChatBot from './FinanceChatBot';
import { useTransactions } from '@/contexts/TransactionsContext';
import { exportToCSV } from '@/utils/exportUtils';

// Dashboard component props interface
interface DashboardProps {
  onLogout: () => void; // Function to handle user logout
  user?: any; // Optional user data from Supabase (can be extended with proper typing)
}

// Main dashboard component for authenticated users
const Dashboard = ({ onLogout, user }: DashboardProps) => {
  const { transactions } = useTransactions();
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    type: 'month' as 'month' | 'custom'
  });

  // Filter transactions based on date range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
  });

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate net worth (removed investments as it's not in database schema)
  const netWorth = totalIncome - totalExpenses;

  const handleExport = () => {
    exportToCSV(filteredTransactions, 'expense-tracker-data.csv');
  };

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="space-y-4 mt-6">
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="w-full justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile-friendly Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-lg md:text-xl font-bold text-white">$</span>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">ExpenseTracker</h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Financial Dashboard</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
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

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Mobile-first grid layout */}
        <div className="space-y-6">
          
          {/* Date Range Selector */}
          <DateRangeSelector onDateRangeChange={setDateRange} />

          {/* Summary Cards and AI Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Summary Cards - 2x2 grid */}
            <div className="lg:col-span-1 space-y-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                  <CardHeader className="pb-2 px-3 md:px-4">
                    <CardTitle className="text-xs md:text-sm font-medium flex items-center">
                      <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Income</span>
                      <span className="sm:hidden">Inc</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-4">
                    <div className="text-lg md:text-2xl font-bold">${totalIncome.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                  <CardHeader className="pb-2 px-3 md:px-4">
                    <CardTitle className="text-xs md:text-sm font-medium flex items-center">
                      <TrendingDown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Expenses</span>
                      <span className="sm:hidden">Exp</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-4">
                    <div className="text-lg md:text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                  <CardHeader className="pb-2 px-3 md:px-4">
                    <CardTitle className="text-xs md:text-sm font-medium flex items-center">
                      <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Balance</span>
                      <span className="sm:hidden">Bal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-4">
                    <div className="text-lg md:text-2xl font-bold">${netWorth.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br ${netWorth >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-orange-500 to-orange-600'} text-white border-0`}>
                  <CardHeader className="pb-2 px-3 md:px-4">
                    <CardTitle className="text-xs md:text-sm font-medium">
                      <span className="hidden sm:inline">Net Worth</span>
                      <span className="sm:hidden">Net</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-4">
                    <div className="text-lg md:text-2xl font-bold">${netWorth.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Summary Section */}
              <AISummarySection transactions={filteredTransactions} dateRange={dateRange} />
            </div>

            {/* Transactions List */}
            <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="flex items-center justify-between text-sm md:text-base">
                  Recent Transactions
                  <Badge variant="secondary" className="text-xs">{filteredTransactions.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TransactionsList transactions={filteredTransactions} />
              </CardContent>
            </Card>

            {/* Finance Chat Bot */}
            <div className="lg:col-span-1">
              <FinanceChatBot transactions={filteredTransactions} />
            </div>
          </div>

          {/* Charts Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="px-4 py-3 md:px-6 md:py-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="flex items-center text-sm md:text-base">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Financial Overview
                </span>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Analyze your spending patterns and financial trends
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <FinancialCharts transactions={filteredTransactions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
