# Database Setup Documentation

## Overview
This document provides detailed information about the database schema, security policies, and setup procedures for the ExpenseTracker application.

## Database Schema

### Tables

#### transactions
Main table for storing user transaction data with proper security controls.

```sql
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
```

**Column Descriptions:**
- `id`: Primary key, auto-generated UUID
- `user_id`: Links transaction to authenticated user (not foreign key to auth.users for security)
- `amount`: Decimal with 2 decimal places for precise currency calculations
- `description`: User-provided description of the transaction
- `category`: Categorization for filtering and reporting
- `type`: Enum constraint ensuring only 'income' or 'expense' values
- `date`: When the transaction occurred (not when it was recorded)
- `created_at`: Automatic timestamp when record was created
- `updated_at`: Automatic timestamp updated via trigger

#### profiles
User profile information table linked to Supabase auth.

```sql
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE, -- Reference to auth.users.id
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### Row Level Security (RLS) Policies

#### transactions Table Policies

**Read Policy - "Users can view their own transactions"**
```sql
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);
```
- Allows users to only see transactions they created
- Uses Supabase's auth.uid() function to get current user ID

**Create Policy - "Users can create their own transactions"**
```sql
CREATE POLICY "Users can create their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```
- Ensures users can only create transactions for themselves
- Validates user_id matches authenticated user on insert

**Update Policy - "Users can update their own transactions"**
```sql
CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id);
```
- Allows users to modify only their own transactions
- Checks ownership before allowing updates

**Delete Policy - "Users can delete their own transactions"**
```sql
CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);
```
- Permits users to delete only their own transactions
- Verifies ownership before deletion

## Database Functions

### update_updated_at_column()
Automatically updates the `updated_at` timestamp when records are modified.

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the updated_at field to current timestamp when row is modified
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

**Usage**: Attached to tables via triggers to maintain audit trails.

### handle_new_user()
Creates user profile when new user registers via Supabase Auth.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new user profile when auth user is created
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

**Usage**: Triggered on auth.users INSERT to create corresponding profile.

## Database Triggers

### update_transactions_updated_at
Automatically updates timestamps on transaction modifications.

```sql
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

### on_auth_user_created
Creates user profile when new user registers.

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Indexes

Performance optimization indexes for common query patterns:

```sql
-- User-based queries (most common)
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);

-- Date-based filtering and sorting
CREATE INDEX idx_transactions_date ON public.transactions(date);

-- Category-based filtering
CREATE INDEX idx_transactions_category ON public.transactions(category);
```

## Security Considerations

### Row Level Security (RLS)
- **ENABLED** on all user data tables
- Prevents data leakage between users
- Enforced at database level regardless of application code
- Uses Supabase's built-in auth.uid() function

### Function Security
- All functions use `SECURITY DEFINER` with explicit `search_path`
- Prevents SQL injection and privilege escalation
- Follows Supabase security best practices

### Data Validation
- Type constraints on transaction types (income/expense)
- NOT NULL constraints on required fields
- Decimal precision for monetary values
- UUID primary keys for security and uniqueness

## Migration History

### Initial Migration (v1)
- Created transactions table with full schema
- Implemented RLS policies for user data isolation
- Added automatic timestamp triggers
- Created performance indexes

### Security Update (v2)
- Updated function search paths for security compliance
- Fixed function security definer settings
- Addressed Supabase security linter warnings

## Backup and Recovery

### Automated Backups
Supabase provides automatic daily backups with point-in-time recovery.

### Manual Backup
```sql
-- Export all user data (replace USER_ID with actual UUID)
COPY (
  SELECT * FROM transactions WHERE user_id = 'USER_ID'
) TO '/path/to/backup.csv' WITH CSV HEADER;
```

## Performance Monitoring

### Query Performance
Monitor slow queries in Supabase dashboard under Logs > Postgres Logs.

### Common Slow Queries
1. Unfiltered date ranges
2. Category searches without indexes
3. Complex aggregations across large datasets

### Optimization Strategies
1. Use date range filters
2. Implement pagination
3. Cache aggregated data
4. Use appropriate indexes

## Troubleshooting

### Common Issues

**RLS Policy Violations**
- Ensure user is authenticated before database operations
- Verify user_id is correctly set in INSERT operations
- Check that auth.uid() returns expected value

**Performance Issues**
- Review query execution plans
- Check index usage
- Monitor connection pooling
- Analyze query patterns

**Data Consistency**
- Verify trigger execution
- Check constraint violations
- Monitor transaction isolation levels

### Debug Commands

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'transactions';

-- View user's transactions
SELECT * FROM transactions WHERE user_id = auth.uid();

-- Check index usage
EXPLAIN ANALYZE SELECT * FROM transactions WHERE user_id = 'user-uuid';
```