
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface AISummarySectionProps {
  transactions: Transaction[];
  dateRange: { start: Date; end: Date; type: 'month' | 'custom' };
}

const AISummarySection = ({ transactions, dateRange }: AISummarySectionProps) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<Array<{ type: 'positive' | 'negative' | 'neutral'; text: string }>>([]);

  const generateSummary = () => {
    setIsGenerating(true);
    
    // Simulate AI generation - in real app, this would call OpenAI API
    setTimeout(() => {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const savings = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? (savings / totalIncome * 100).toFixed(1) : '0';

      setSummary(`During this period, you earned $${totalIncome.toLocaleString()} and spent $${totalExpenses.toLocaleString()}, resulting in ${savings >= 0 ? 'savings' : 'a deficit'} of $${Math.abs(savings).toLocaleString()}. Your savings rate is ${savingsRate}%.`);

      // Generate insights
      const newInsights = [];
      if (parseFloat(savingsRate) > 20) {
        newInsights.push({ type: 'positive' as const, text: 'Excellent savings rate! You\'re on track for strong financial health.' });
      } else if (parseFloat(savingsRate) < 10) {
        newInsights.push({ type: 'negative' as const, text: 'Consider reducing expenses or increasing income to improve your savings rate.' });
      }

      const topExpenseCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      const highestCategory = Object.entries(topExpenseCategory)
        .sort(([,a], [,b]) => b - a)[0];

      if (highestCategory) {
        newInsights.push({ 
          type: 'neutral' as const, 
          text: `Your highest spending category is ${highestCategory[0]} at $${highestCategory[1].toLocaleString()}.` 
        });
      }

      setInsights(newInsights);
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      generateSummary();
    }
  }, [transactions, dateRange]);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Financial Summary
          <Button
            variant="ghost"
            size="sm"
            onClick={generateSummary}
            disabled={isGenerating}
            className="ml-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          AI-powered insights based on your spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ) : (
          <>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {summary || 'No data available for the selected period.'}
            </p>
            
            {insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-800">Key Insights:</h4>
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {insight.type === 'positive' && <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />}
                    {insight.type === 'negative' && <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />}
                    {insight.type === 'neutral' && <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
                    <p className="text-sm text-gray-600">{insight.text}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AISummarySection;
