
// TransactionsContext.tsx - React Context for managing transaction state with Supabase integration
// This context provides transaction CRUD operations and real-time data synchronization

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define the shape of our context - includes transactions array and CRUD operations
interface TransactionsContextType {
  transactions: Transaction[]; // Array of all user transactions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>; // Create new transaction
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>; // Update existing transaction
  deleteTransaction: (id: string) => Promise<void>; // Delete transaction
  loading: boolean; // Loading state for UI feedback
  refreshTransactions: () => Promise<void>; // Manual refresh function
}

// Create the context with undefined default (will throw error if used outside provider)
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Custom hook to access transaction context with error handling
export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

// Props interface for the provider component
interface TransactionsProviderProps {
  children: ReactNode; // Child components that need access to transaction context
}

// Main provider component that wraps the app and provides transaction functionality
export const TransactionsProvider = ({ children }: TransactionsProviderProps) => {
  // State management for transactions and loading status
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(true); // Start with loading true

  // Fetch all transactions for the current authenticated user
  const fetchTransactions = async () => {
    try {
      setLoading(true); // Set loading state for UI feedback
      
      // Get current user session to ensure user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found'); // Debug log
        setTransactions([]); // Clear transactions if no user
        return;
      }

      // Query transactions table with user filtering and ordering
      const { data, error } = await supabase
        .from('transactions') // Query the transactions table
        .select('*') // Select all columns
        .eq('user_id', user.id) // Filter by current user ID (RLS also enforces this)
        .order('date', { ascending: false }) // Order by date, newest first
        .order('created_at', { ascending: false }); // Secondary sort by creation time

      if (error) {
        console.error('Error fetching transactions:', error); // Log error for debugging
        toast({
          title: 'Error',
          description: 'Failed to load transactions. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Transform database records to match our Transaction interface
      const transformedTransactions: Transaction[] = data.map(record => ({
        id: record.id,
        amount: parseFloat(record.amount.toString()), // Convert decimal to number with string conversion
        description: record.description,
        category: record.category,
        type: record.type as 'income' | 'expense', // Type assertion for enum
        date: record.date, // Date is already in correct format
        account: 'default', // Add default account for compatibility
      }));

      setTransactions(transformedTransactions); // Update state with fetched data
    } catch (error) {
      console.error('Unexpected error fetching transactions:', error); // Log unexpected errors
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading transactions.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false); // Always clear loading state
    }
  };

  // Add a new transaction to the database
  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      // Get current user to associate transaction with them
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add transactions.',
          variant: 'destructive',
        });
        return;
      }

      // Insert new transaction into database
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id, // Associate with current user
          amount: transactionData.amount,
          description: transactionData.description,
          category: transactionData.category,
          type: transactionData.type,
          date: transactionData.date,
        }])
        .select() // Return the inserted record
        .single(); // Expect single record

      if (error) {
        console.error('Error adding transaction:', error); // Debug logging
        toast({
          title: 'Error',
          description: 'Failed to add transaction. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Transform and add to local state for immediate UI update
      const newTransaction: Transaction = {
        id: data.id,
        amount: parseFloat(data.amount.toString()),
        description: data.description,
        category: data.category,
        type: data.type as 'income' | 'expense',
        date: data.date,
        account: 'default', // Add default account for compatibility
      };

      // Optimistic update - add to beginning of array
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Transaction added successfully!',
      });
    } catch (error) {
      console.error('Unexpected error adding transaction:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while adding the transaction.',
        variant: 'destructive',
      });
    }
  };

  // Update an existing transaction in the database
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      // Remove id from updates object as it shouldn't be updated
      const { id: _, ...updateData } = updates;
      
      // Update transaction in database
      const { error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id); // Update specific transaction by ID

      if (error) {
        console.error('Error updating transaction:', error);
        toast({
          title: 'Error',
          description: 'Failed to update transaction. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Update local state for immediate UI feedback
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id 
            ? { ...transaction, ...updates } // Merge updates
            : transaction // Keep unchanged
        )
      );

      toast({
        title: 'Success',
        description: 'Transaction updated successfully!',
      });
    } catch (error) {
      console.error('Unexpected error updating transaction:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while updating the transaction.',
        variant: 'destructive',
      });
    }
  };

  // Delete a transaction from the database
  const deleteTransaction = async (id: string) => {
    try {
      // Delete transaction from database
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id); // Delete specific transaction by ID

      if (error) {
        console.error('Error deleting transaction:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete transaction. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Remove from local state for immediate UI update
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));

      toast({
        title: 'Success',
        description: 'Transaction deleted successfully!',
      });
    } catch (error) {
      console.error('Unexpected error deleting transaction:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the transaction.',
        variant: 'destructive',
      });
    }
  };

  // Manual refresh function for user-triggered data updates
  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  // Effect to fetch transactions when component mounts or auth state changes
  useEffect(() => {
    // Initial fetch of transactions
    fetchTransactions();

    // Set up real-time subscription for transaction changes
    const channel = supabase
      .channel('transactions-changes') // Unique channel name
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'transactions',
        },
        (payload) => {
          console.log('Real-time transaction change:', payload); // Debug logging
          
          // Refresh transactions when any change occurs
          // This ensures all connected clients stay in sync
          fetchTransactions();
        }
      )
      .subscribe(); // Start listening

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, []); // Empty dependency array - run once on mount

  // Provide all transaction functionality to child components
  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      addTransaction, 
      updateTransaction, 
      deleteTransaction, 
      loading, 
      refreshTransactions 
    }}>
      {children}
    </TransactionsContext.Provider>
  );
};
