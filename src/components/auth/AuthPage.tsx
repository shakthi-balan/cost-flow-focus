
// AuthPage.tsx - Authentication component with Supabase integration
// Provides both login and signup functionality with proper error handling

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client

// AuthPage component - no props needed as it uses Supabase auth state management
const AuthPage = () => {
  // State for loading indicators and form data
  const [isLoading, setIsLoading] = useState(false); // Loading state for buttons
  const [formData, setFormData] = useState({
    email: '', // User email for login/signup
    password: '', // User password
    name: '' // Full name for signup only
  });

  // Handle form submission for both login and signup
  const handleSubmit = async (type: 'login' | 'signup') => {
    try {
      setIsLoading(true); // Show loading state
      
      // Validate required fields
      if (!formData.email || !formData.password) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address.',
          variant: 'destructive',
        });
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        toast({
          title: 'Password Too Short',
          description: 'Password must be at least 6 characters long.',
          variant: 'destructive',
        });
        return;
      }

      if (type === 'signup') {
        // Handle user registration
        console.log('Attempting to sign up user:', formData.email); // Debug logging
        
        // Validate name for signup
        if (!formData.name.trim()) {
          toast({
            title: 'Name Required',
            description: 'Please enter your full name.',
            variant: 'destructive',
          });
          return;
        }

        // Create new user account with metadata
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            // Include full name in user metadata
            data: {
              full_name: formData.name,
            },
            // Set redirect URL for email confirmation
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          console.error('Signup error:', error); // Debug logging
          
          // Handle specific signup errors
          switch (error.message) {
            case 'User already registered':
              toast({
                title: 'Account Exists',
                description: 'An account with this email already exists. Please sign in instead.',
                variant: 'destructive',
              });
              break;
            case 'Password should be at least 6 characters':
              toast({
                title: 'Password Too Short',
                description: 'Password must be at least 6 characters long.',
                variant: 'destructive',
              });
              break;
            default:
              toast({
                title: 'Signup Failed',
                description: error.message || 'Failed to create account. Please try again.',
                variant: 'destructive',
              });
          }
          return;
        }

        console.log('Signup successful:', data); // Debug logging
        
        // Show success message
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account.',
        });

      } else {
        // Handle user login
        console.log('Attempting to sign in user:', formData.email); // Debug logging
        
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Login error:', error); // Debug logging
          
          // Handle specific login errors
          switch (error.message) {
            case 'Invalid login credentials':
              toast({
                title: 'Login Failed',
                description: 'Invalid email or password. Please check your credentials and try again.',
                variant: 'destructive',
              });
              break;
            case 'Email not confirmed':
              toast({
                title: 'Email Not Verified',
                description: 'Please check your email and click the verification link.',
                variant: 'destructive',
              });
              break;
            case 'Too many requests':
              toast({
                title: 'Too Many Attempts',
                description: 'Too many login attempts. Please wait a moment and try again.',
                variant: 'destructive',
              });
              break;
            default:
              toast({
                title: 'Login Failed',
                description: error.message || 'Failed to sign in. Please try again.',
                variant: 'destructive',
              });
          }
          return;
        }

        console.log('Login successful:', data); // Debug logging
        
        // Show success message
        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in to your account.',
        });
      }

    } catch (error) {
      console.error('Unexpected authentication error:', error); // Debug logging
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">$</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ExpenseTracker</h1>
          <p className="text-gray-600">Manage your finances with ease</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Create an account or sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => handleSubmit('login')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => handleSubmit('signup')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
