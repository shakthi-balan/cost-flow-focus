
import { Transaction } from '@/types/transaction';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="w-4 h-4 text-green-600" />;
      case 'expense':
        return <ArrowDownCircle className="w-4 h-4 text-red-600" />;
      case 'investment':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
    }
  };

  const getAmountColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'investment':
        return 'text-blue-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: window.innerWidth < 640 ? '2-digit' : 'numeric'
    });
  };

  // Sort transactions by date (newest first) and limit to recent ones
  const sortedTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <ScrollArea className="h-80 md:h-96">
      <div className="space-y-1 p-2 md:p-4">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {getTransactionIcon(transaction.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs capitalize hidden sm:inline-flex ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-700' :
                      transaction.type === 'expense' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {transaction.type}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500 space-x-2">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                  <span className="sm:hidden">•</span>
                  <span className="sm:hidden">{transaction.account}</span>
                </div>
                <div className="hidden sm:block text-xs text-gray-400 mt-1">
                  {transaction.account}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm md:text-base font-semibold ${getAmountColor(transaction.type)}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        
        {sortedTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Start by adding your first transaction</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default TransactionsList;
