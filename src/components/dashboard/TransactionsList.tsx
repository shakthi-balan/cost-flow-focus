
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expense':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'investment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      default:
        return 'text-gray-600';
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-1 p-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <Badge className={`${getTypeColor(transaction.type)} capitalize`}>
                  {transaction.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">
                      {transaction.category}
                    </p>
                    {transaction.subcategory && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          {transaction.subcategory}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')} • {transaction.account}
                </p>
                <p className={`text-sm font-semibold ${getAmountColor(transaction.type)}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TransactionsList;
