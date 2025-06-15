
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Transaction } from '@/types/transaction';
import { useMemo } from 'react';

interface FinancialChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];

const FinancialCharts = ({ transactions }: FinancialChartsProps) => {
  const chartData = useMemo(() => {
    // Monthly summary data
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0, investments: 0 };
      }
      acc[month][transaction.type === 'expense' ? 'expenses' : transaction.type === 'income' ? 'income' : 'investments'] += transaction.amount;
      return acc;
    }, {} as Record<string, any>);

    // Category breakdown for pie chart
    const categoryData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      monthly: Object.values(monthlyData),
      categories: Object.entries(categoryData).map(([name, value]) => ({ name, value }))
    };
  }, [transactions]);

  return (
    <div className="space-y-8">
      {/* Monthly Overview Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="income" fill="#10B981" name="Income" />
            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            <Bar dataKey="investments" fill="#3B82F6" name="Investments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Expense Categories Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.categories}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.categories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Trend Line Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;
