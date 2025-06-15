
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface FinanceChatBotProps {
  transactions: Transaction[];
}

const FinanceChatBot = ({ transactions }: FinanceChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your personal finance assistant. I can help you analyze your spending patterns, suggest budgeting strategies, and answer questions about your financial data. How can I help you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('spending') || lowerMessage.includes('expense')) {
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return `Your total expenses are $${totalExpenses.toLocaleString()}. Your highest spending categories are typically dining, groceries, and transportation. Would you like specific advice on reducing expenses in any category?`;
    }
    
    if (lowerMessage.includes('income')) {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      return `Your total income is $${totalIncome.toLocaleString()}. This gives you a solid foundation for building your financial future. Have you considered setting up automatic savings transfers?`;
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('save')) {
      return 'For effective budgeting, I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Based on your current spending patterns, you might want to focus on tracking your discretionary expenses more closely.';
    }
    
    if (lowerMessage.includes('investment')) {
      const totalInvestments = transactions.filter(t => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);
      return `You've invested $${totalInvestments.toLocaleString()} so far. That's great progress! Consider diversifying your portfolio and maintaining consistent monthly investments for long-term growth.`;
    }
    
    return 'That\'s an interesting question! Based on your financial data, I\'d recommend focusing on creating a comprehensive budget, building an emergency fund, and considering long-term investment strategies. Is there a specific aspect of your finances you\'d like to discuss?';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Finance Chat Assistant
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Ask questions about your finances and get personalized advice
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        <ScrollArea className="flex-1 h-64 md:h-80 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isBot ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {message.isBot ? <Bot className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-gray-600" />}
                </div>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.isBot 
                    ? 'bg-blue-50 text-blue-900' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your finances..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isTyping}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceChatBot;
