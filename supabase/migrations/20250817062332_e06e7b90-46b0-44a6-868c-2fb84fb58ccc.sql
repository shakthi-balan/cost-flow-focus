-- Create transactions table for persistent storage
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Reference to auth.users.id
  amount DECIMAL(10,2) NOT NULL, -- Transaction amount with 2 decimal places
  description TEXT NOT NULL, -- Description of the transaction
  category TEXT NOT NULL, -- Category like 'food', 'transport', etc.
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')), -- Transaction type
  date DATE NOT NULL DEFAULT CURRENT_DATE, -- Transaction date
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), -- Record creation timestamp
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() -- Record update timestamp
);

-- Enable Row Level Security for user data protection
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can create their own transactions
CREATE POLICY "Users can create their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own transactions
CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own transactions
CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the updated_at field to current timestamp when row is modified
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update timestamps on transaction updates
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance on user_id
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);

-- Create index for better query performance on date queries
CREATE INDEX idx_transactions_date ON public.transactions(date);

-- Create index for better query performance on category filtering
CREATE INDEX idx_transactions_category ON public.transactions(category);