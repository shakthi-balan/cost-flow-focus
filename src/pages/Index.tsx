
// Index.tsx - Main application entry point with Supabase authentication integration
// This component handles authentication state and routing between auth and dashboard views

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js'; // Import User type from Supabase
import AuthPage from '@/components/auth/AuthPage';
import Dashboard from '@/components/dashboard/Dashboard';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import { TransactionsProvider } from '@/contexts/TransactionsContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client

const Index = () => {
  // State management for authentication and UI
  const [user, setUser] = useState<User | null>(null); // Current authenticated user
  const [loading, setLoading] = useState(true); // Loading state for initial auth check
  const [showAddModal, setShowAddModal] = useState(false); // Modal visibility state

  // Initialize authentication state and set up auth listeners
  useEffect(() => {
    // Function to handle authentication state changes
    const initializeAuth = async () => {
      try {
        // Check for existing session on app load
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error); // Debug logging
        } else {
          console.log('Initial session:', session); // Debug logging
          setUser(session?.user ?? null); // Set user from session
        }
      } catch (error) {
        console.error('Error initializing auth:', error); // Handle unexpected errors
      } finally {
        setLoading(false); // Clear loading state after auth check
      }
    };

    // Set up real-time authentication state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session); // Debug logging
        
        // Update user state based on authentication events
        setUser(session?.user ?? null);
        setLoading(false); // Clear loading state on auth change
        
        // Handle specific authentication events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email); // Debug logging
            break;
          case 'SIGNED_OUT':
            console.log('User signed out'); // Debug logging
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed for user:', session?.user?.email); // Debug logging
            break;
          default:
            console.log('Auth event:', event); // Log other auth events
        }
      }
    );

    // Initialize authentication state
    initializeAuth();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - run once on mount

  // Handle user logout with proper cleanup
  const handleLogout = async () => {
    try {
      console.log('Logging out user...'); // Debug logging
      
      // Sign out from Supabase (this will trigger auth state change)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during logout:', error); // Log logout errors
      } else {
        console.log('User logged out successfully'); // Debug logging
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error); // Handle unexpected errors
    }
  };

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          {/* Loading spinner with app branding */}
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-white">$</span>
          </div>
          <p className="text-gray-600">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  // Show authentication page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Main application view for authenticated users
  return (
    <TransactionsProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Pass user data and logout handler to dashboard */}
        <Dashboard onLogout={handleLogout} user={user} />
        
        {/* Floating Action Button for adding new transactions */}
        {/* Positioned fixed for easy access across all dashboard views */}
        <Button
          onClick={() => setShowAddModal(true)} // Open add transaction modal
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
          size="lg"
          aria-label="Add new transaction" // Accessibility label
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6" />
        </Button>

        {/* Modal for adding new transactions */}
        <AddTransactionModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} // Handle modal close
        />
      </div>
    </TransactionsProvider>
  );
};

export default Index;
