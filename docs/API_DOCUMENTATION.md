
# API Documentation

## Overview

The Expense Tracker application uses Supabase as its Backend-as-a-Service (BaaS) platform, providing authentication, database operations, and real-time functionality. This document outlines both the current API usage and the planned API structure for full functionality.

## Base Configuration

```typescript
// Supabase Configuration
const supabaseUrl = 'https://ylwajcnexpjwohmjeopj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// Client Initialization
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Authentication API

### Sign Up
Creates a new user account and automatically triggers profile creation.

**Endpoint**: `POST /auth/v1/signup`

```typescript
// Request
const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  return { data, error }
}

// Response Success
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "user_metadata": {
        "full_name": "John Doe"
      }
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_in": 3600
    }
  },
  "error": null
}

// Response Error
{
  "data": null,
  "error": {
    "message": "User already registered",
    "status": 400
  }
}
```

### Sign In
Authenticates an existing user.

**Endpoint**: `POST /auth/v1/token?grant_type=password`

```typescript
// Request
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Response Success
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "last_sign_in_at": "2024-01-01T00:00:00Z"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_in": 3600
    }
  },
  "error": null
}
```

### Sign Out
Ends the user session.

**Endpoint**: `POST /auth/v1/logout`

```typescript
// Request
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Response
{
  "error": null
}
```

### Get Current User
Retrieves the current authenticated user.

```typescript
// Request
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Response
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe"
    }
  },
  "error": null
}
```

## Database API (Current Implementation)

### Profiles Table

#### Get User Profile
```typescript
// Request
const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

// Response
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

#### Update User Profile
```typescript
// Request
const updateProfile = async (userId: string, updates: ProfileUpdate) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Request Body
interface ProfileUpdate {
  full_name?: string
  avatar_url?: string
}
```

### Chat System (Current Implementation)

#### Get User Chats
```typescript
// Request
const getUserChats = async (userId: string) => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Response
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Financial Planning Chat",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

#### Create New Chat
```typescript
// Request
const createChat = async (userId: string, title: string) => {
  const { data, error } = await supabase
    .from('chats')
    .insert({
      user_id: userId,
      title: title
    })
    .select()
    .single()
  
  return { data, error }
}
```

#### Get Chat Messages
```typescript
// Request
const getChatMessages = async (chatId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

// Response
{
  "data": [
    {
      "id": "uuid",
      "chat_id": "uuid",
      "sender": "user",
      "content": "How can I improve my savings rate?",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "chat_id": "uuid",
      "sender": "ai",
      "content": "Based on your spending patterns, I recommend...",
      "created_at": "2024-01-01T00:00:01Z"
    }
  ],
  "error": null
}
```

## Database API (Required for Full Functionality)

### Transactions API

#### Create Transaction
```typescript
// Request
const createTransaction = async (transaction: TransactionCreate) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single()
  
  return { data, error }
}

// Request Body
interface TransactionCreate {
  user_id: string
  type: 'income' | 'expense' | 'investment'
  amount: number
  description: string
  category: string
  subcategory?: string
  account: string
  date: string // ISO date string
  note?: string
}

// Response
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "type": "expense",
    "amount": 50.00,
    "description": "Grocery shopping",
    "category": "Food",
    "subcategory": "Groceries",
    "account": "checking",
    "date": "2024-01-01",
    "note": "Weekly grocery run",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

#### Get User Transactions
```typescript
// Request
const getTransactions = async (
  userId: string, 
  options?: {
    startDate?: string
    endDate?: string
    type?: 'income' | 'expense' | 'investment'
    category?: string
    limit?: number
    offset?: number
  }
) => {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
  
  if (options?.startDate) {
    query = query.gte('date', options.startDate)
  }
  
  if (options?.endDate) {
    query = query.lte('date', options.endDate)
  }
  
  if (options?.type) {
    query = query.eq('type', options.type)
  }
  
  if (options?.category) {
    query = query.eq('category', options.category)
  }
  
  query = query
    .order('date', { ascending: false })
    .limit(options?.limit || 50)
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }
  
  const { data, error } = await query
  return { data, error }
}

// Response
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "expense",
      "amount": 50.00,
      "description": "Grocery shopping",
      "category": "Food",
      "subcategory": "Groceries",
      "account": "checking",
      "date": "2024-01-01",
      "note": "Weekly grocery run",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

#### Update Transaction
```typescript
// Request
const updateTransaction = async (
  transactionId: string, 
  updates: Partial<TransactionCreate>
) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', transactionId)
    .select()
    .single()
  
  return { data, error }
}
```

#### Delete Transaction
```typescript
// Request
const deleteTransaction = async (transactionId: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
  
  return { error }
}

// Response
{
  "error": null
}
```

### Categories API

#### Get User Categories
```typescript
// Request
const getCategories = async (userId: string, type?: string) => {
  let query = supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${userId},is_default.eq.true`)
  
  if (type) {
    query = query.eq('type', type)
  }
  
  const { data, error } = await query.order('name')
  return { data, error }
}
```

#### Create Custom Category
```typescript
// Request
const createCategory = async (category: CategoryCreate) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()
  
  return { data, error }
}

// Request Body
interface CategoryCreate {
  user_id: string
  name: string
  type: 'income' | 'expense' | 'investment'
  parent_id?: string
  is_default: false
}
```

### Accounts API

#### Get User Accounts
```typescript
// Request
const getAccounts = async (userId: string) => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('name')
  
  return { data, error }
}
```

#### Create Account
```typescript
// Request
const createAccount = async (account: AccountCreate) => {
  const { data, error } = await supabase
    .from('accounts')
    .insert(account)
    .select()
    .single()
  
  return { data, error }
}

// Request Body
interface AccountCreate {
  user_id: string
  name: string
  type: 'checking' | 'savings' | 'credit-card' | 'investment' | 'cash'
  balance: number
  is_active: true
}
```

#### Update Account Balance
```typescript
// Request
const updateAccountBalance = async (accountId: string, balance: number) => {
  const { data, error } = await supabase
    .from('accounts')
    .update({ balance })
    .eq('id', accountId)
    .select()
    .single()
  
  return { data, error }
}
```

### Analytics API

#### Get Financial Summary
```typescript
// Request
const getFinancialSummary = async (
  userId: string, 
  startDate: string, 
  endDate: string
) => {
  const { data, error } = await supabase
    .rpc('get_financial_summary', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate
    })
  
  return { data, error }
}

// Response
{
  "data": {
    "total_income": 5000.00,
    "total_expenses": 3500.00,
    "total_investments": 1000.00,
    "net_savings": 1500.00,
    "savings_rate": 0.30,
    "top_expense_categories": [
      { "category": "Food", "amount": 800.00 },
      { "category": "Housing", "amount": 1200.00 }
    ]
  },
  "error": null
}
```

#### Get Spending Trends
```typescript
// Request
const getSpendingTrends = async (userId: string, months: number = 12) => {
  const { data, error } = await supabase
    .rpc('get_spending_trends', {
      user_id: userId,
      months_back: months
    })
  
  return { data, error }
}

// Response
{
  "data": [
    {
      "month": "2024-01",
      "income": 5000.00,
      "expenses": 3500.00,
      "investments": 1000.00
    },
    {
      "month": "2024-02",
      "income": 5200.00,
      "expenses": 3200.00,
      "investments": 1200.00
    }
  ],
  "error": null
}
```

## Real-time Subscriptions

### Subscribe to Transaction Changes
```typescript
// Request
const subscribeToTransactions = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('transactions')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

// Usage
const subscription = subscribeToTransactions(userId, (payload) => {
  console.log('Transaction changed:', payload)
  // Update local state
})

// Cleanup
subscription.unsubscribe()
```

### Subscribe to Chat Messages
```typescript
// Request
const subscribeToChatMessages = (chatId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`chat:${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      },
      callback
    )
    .subscribe()
}
```

## Edge Functions (Future Implementation)

### AI Analysis Function
```typescript
// Endpoint: POST /functions/v1/ai-analysis
// Request
const requestAIAnalysis = async (userId: string, analysisType: string) => {
  const { data, error } = await supabase.functions.invoke('ai-analysis', {
    body: {
      user_id: userId,
      analysis_type: analysisType,
      date_range: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    }
  })
  
  return { data, error }
}

// Response
{
  "data": {
    "summary": "Your spending analysis shows...",
    "insights": [
      {
        "type": "positive",
        "title": "Great savings rate",
        "description": "You're saving 25% of your income"
      }
    ],
    "recommendations": [
      "Consider increasing your emergency fund",
      "Look into investment opportunities"
    ]
  },
  "error": null
}
```

### Export Data Function
```typescript
// Endpoint: POST /functions/v1/export-data
// Request
const exportUserData = async (userId: string, format: 'csv' | 'json' | 'pdf') => {
  const { data, error } = await supabase.functions.invoke('export-data', {
    body: {
      user_id: userId,
      format: format,
      date_range: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    }
  })
  
  return { data, error }
}

// Response
{
  "data": {
    "download_url": "https://storage.supabase.co/exports/user-data.csv",
    "expires_at": "2024-01-01T01:00:00Z"
  },
  "error": null
}
```

## Error Handling

### Common Error Responses
```typescript
// Authentication Error
{
  "error": {
    "message": "Invalid login credentials",
    "status": 400,
    "code": "invalid_credentials"
  }
}

// Authorization Error
{
  "error": {
    "message": "Row Level Security Policy violated",
    "status": 403,
    "code": "rls_violation"
  }
}

// Validation Error
{
  "error": {
    "message": "Invalid input data",
    "status": 422,
    "code": "validation_error",
    "details": {
      "amount": "Must be a positive number",
      "date": "Must be a valid date"
    }
  }
}

// Rate Limit Error
{
  "error": {
    "message": "Too many requests",
    "status": 429,
    "code": "rate_limit_exceeded"
  }
}
```

## Rate Limiting

Supabase provides built-in rate limiting:
- Authentication: 30 requests per hour per IP
- Database queries: 100 requests per second per API key
-

 Real-time connections: 100 concurrent connections per project

## Security Considerations

### Row Level Security (RLS)
All tables implement RLS policies to ensure users can only access their own data:

```sql
-- Example RLS Policy
CREATE POLICY "Users can only access their own transactions"
ON transactions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### API Key Management
- **Anon Key**: Used for client-side operations, respects RLS
- **Service Role Key**: Used for admin operations, bypasses RLS (not exposed to client)

### Data Validation
All API endpoints validate input data:
- Required fields must be present
- Data types must match schema
- Business rules are enforced (e.g., positive amounts for transactions)

This API documentation provides a comprehensive guide for integrating with the expense tracker backend services, covering both current functionality and planned features.
