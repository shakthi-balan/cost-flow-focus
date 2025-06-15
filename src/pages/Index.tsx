
import { useState, useEffect } from 'react';
import AuthPage from '@/components/auth/AuthPage';
import Dashboard from '@/components/dashboard/Dashboard';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Simulate authentication state - in real app this would come from Supabase
  useEffect(() => {
    // For demo purposes, we'll simulate being logged in
    // In production, this would check Supabase auth state
    const authState = localStorage.getItem('demo_auth');
    setIsAuthenticated(authState === 'true');
  }, []);

  const handleAuth = () => {
    setIsAuthenticated(true);
    localStorage.setItem('demo_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('demo_auth');
  };

  if (!isAuthenticated) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Dashboard onLogout={handleLogout} />
      
      {/* Floating Add Button */}
      <Button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
        size="lg"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddTransactionModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </div>
  );
};

export default Index;
