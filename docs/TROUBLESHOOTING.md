# Troubleshooting Guide

## Common Issues and Solutions

### Database Connection Issues

#### Problem: Transactions not persisting after page refresh
**Cause**: App was using local state instead of Supabase database
**Solution**: 
1. Ensure Supabase client is properly configured
2. Check authentication state before database operations
3. Verify Row Level Security (RLS) policies are correctly set up

#### Problem: "new row violates row-level security policy"
**Cause**: User ID not properly set or user not authenticated
**Solution**:
```typescript
// Ensure user is authenticated before database operations
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // Handle unauthenticated state
  return;
}

// Include user_id in insert operations
const { data, error } = await supabase
  .from('transactions')
  .insert([{
    user_id: user.id, // This is crucial for RLS
    // ... other fields
  }]);
```

### Authentication Issues

#### Problem: User gets logged out on page refresh
**Cause**: Not properly handling auth state initialization
**Solution**: Use proper auth state management:
```typescript
useEffect(() => {
  // Check for existing session first
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });

  // Then set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setUser(session?.user ?? null);
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

#### Problem: "requested path is invalid" on login
**Cause**: Incorrect redirect URLs in Supabase project settings
**Solution**: 
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Set Site URL to your app's URL
3. Add your app's URL to Redirect URLs list

### Data Loading Issues

#### Problem: Data not loading or showing as empty
**Debugging Steps**:
1. Check console for error messages
2. Verify user authentication state
3. Check RLS policies allow read access
4. Test database queries in Supabase SQL editor

### Performance Issues

#### Problem: Slow transaction loading
**Solutions**:
1. Ensure database indexes are properly set up
2. Use pagination for large datasets
3. Implement caching strategies
4. Optimize database queries

## Debugging Commands

### Check Authentication State
```typescript
// In browser console
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

### Test Database Connection
```typescript
// In browser console
const { data, error } = await supabase
  .from('transactions')
  .select('count(*)')
  .single();
console.log('Transaction count:', data, error);
```

### View RLS Policies
```sql
-- In Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'transactions';
```

## Error Codes Reference

| Error Code | Description | Solution |
|------------|-------------|----------|
| PGRST116 | Row Level Security violation | Check RLS policies and user authentication |
| PGRST301 | JWT expired | Refresh authentication token |
| 42501 | Permission denied | Verify user has required permissions |
| 23505 | Unique constraint violation | Check for duplicate data |

## Getting Help

1. Check browser console for detailed error messages
2. Review Supabase logs in the dashboard
3. Test authentication flow step by step
4. Verify database schema matches application code
5. Check network requests in browser dev tools

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] User ID properly validated in policies
- [ ] Authentication required for protected routes
- [ ] Sensitive data not exposed in client-side code
- [ ] Proper error handling for auth failures
