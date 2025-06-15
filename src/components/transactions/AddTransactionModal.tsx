
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Transaction } from '@/types/transaction';
import { categories } from '@/data/categories';

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddTransactionModal = ({ open, onOpenChange }: AddTransactionModalProps) => {
  const [transactionType, setTransactionType] = useState<Transaction['type']>('expense');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    subcategory: '',
    account: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category || !formData.account) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    // In production, this would save to Supabase
    const newTransaction: Partial<Transaction> = {
      ...formData,
      type: transactionType,
      amount: parseFloat(formData.amount),
      date: formData.date,
      id: Date.now().toString()
    };

    console.log('New transaction:', newTransaction);
    
    toast({
      title: 'Transaction Added',
      description: `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} of $${formData.amount} has been recorded.`,
    });

    // Reset form
    setFormData({
      amount: '',
      description: '',
      category: '',
      subcategory: '',
      account: '',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      // Reset subcategory when category changes
      ...(field === 'category' ? { subcategory: '' } : {})
    }));
  };

  const selectedCategory = categories[transactionType]?.find(cat => cat.name === formData.category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new income, expense, or investment transaction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Tabs */}
          <Tabs value={transactionType} onValueChange={(value) => setTransactionType(value as Transaction['type'])}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="income" className="text-green-600 data-[state=active]:bg-green-100">Income</TabsTrigger>
              <TabsTrigger value="expense" className="text-red-600 data-[state=active]:bg-red-100">Expense</TabsTrigger>
              <TabsTrigger value="investment" className="text-blue-600 data-[state=active]:bg-blue-100">Investment</TabsTrigger>
            </TabsList>

            <TabsContent value={transactionType} className="space-y-4 mt-6">
              {/* Amount and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[transactionType]?.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select 
                    value={formData.subcategory} 
                    onValueChange={(value) => handleInputChange('subcategory', value)}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory?.subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Account */}
              <div className="space-y-2">
                <Label htmlFor="account">Account *</Label>
                <Select value={formData.account} onValueChange={(value) => handleInputChange('account', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="investment">Investment Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  placeholder="Additional notes (optional)"
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={`
                ${transactionType === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}
                ${transactionType === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}
                ${transactionType === 'investment' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              `}
            >
              Add {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
