
# Deployment Guide

## Overview

This guide covers the deployment process for the Expense Tracker application using the Lovable platform, along with Supabase backend configuration and various environment setups.

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Environment Setup](#environment-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Local Development](#local-development)
5. [Staging Deployment](#staging-deployment)
6. [Production Deployment](#production-deployment)
7. [Custom Domain Setup](#custom-domain-setup)
8. [Environment Variables](#environment-variables)
9. [Database Migrations](#database-migrations)
10. [Monitoring and Analytics](#monitoring-and-analytics)
11. [Troubleshooting](#troubleshooting)
12. [Maintenance](#maintenance)

## Platform Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Deployment**: Lovable Platform
- **Domain**: Custom domain support available
- **CDN**: Global content delivery network

### Architecture
```
User Browser → CDN → Lovable Platform → React App
                ↓
            Supabase Backend → PostgreSQL Database
```

## Environment Setup

### Development Requirements
- Node.js 18+ with npm/yarn
- Git for version control
- Modern web browser
- Code editor (VS Code recommended)

### Project Structure
```
expense-tracker/
├── src/                    # Source code
├── public/                 # Static assets
├── docs/                   # Documentation
├── supabase/               # Supabase configuration
├── package.json           # Dependencies
├── vite.config.ts         # Build configuration
├── tailwind.config.ts     # Styling configuration
└── tsconfig.json          # TypeScript configuration
```

## Supabase Configuration

### 1. Project Setup
```bash
# Navigate to https://supabase.com/dashboard
# Create new project or use existing: ylwajcnexpjwohmjeopj
```

### 2. Database Configuration
```sql
-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER table chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (examples)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can manage own chats" ON chats
  FOR ALL USING (auth.uid() = user_id);
```

### 3. Authentication Settings
Navigate to Authentication > Settings in Supabase Dashboard:

```
Site URL: https://your-app.lovable.app
Redirect URLs: 
  - https://your-app.lovable.app
  - https://your-custom-domain.com (if applicable)
  - http://localhost:5173 (for development)
```

### 4. API Keys
```env
# From Supabase Dashboard > Settings > API
SUPABASE_URL=https://ylwajcnexpjwohmjeopj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Local Development

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

# Install dependencies
npm install

# Create environment file
touch .env.local
```

### 2. Environment Variables
```env
# .env.local
VITE_SUPABASE_URL=https://ylwajcnexpjwohmjeopj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Development Server
```bash
# Start development server
npm run dev

# Server will run on http://localhost:5173
# Hot reload enabled for instant development feedback
```

### 4. Development Workflow
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production (test)
npm run build

# Preview production build
npm run preview
```

## Staging Deployment

### 1. Lovable Platform Setup
- Access your Lovable project dashboard
- Connect your GitHub repository (if using Git workflow)
- Configure automatic deployments

### 2. Staging Environment
```
Staging URL: https://preview-abc123.lovable.app
Purpose: Testing before production release
Auto-deploy: On push to staging branch
```

### 3. Staging Configuration
```env
# Staging environment variables
VITE_SUPABASE_URL=https://ylwajcnexpjwohmjeopj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=staging
```

### 4. Testing Checklist
- [ ] User authentication flow
- [ ] Transaction creation and display
- [ ] Financial charts rendering
- [ ] AI features functionality
- [ ] Mobile responsiveness
- [ ] Performance metrics
- [ ] Error handling

## Production Deployment

### 1. Pre-deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Performance optimized
- [ ] Security audit completed

### 2. Deployment Process
```bash
# Using Lovable Platform
1. Navigate to project dashboard
2. Click "Deploy to Production"
3. Confirm deployment settings
4. Monitor deployment progress
5. Verify deployment success
```

### 3. Production Environment
```
Production URL: https://your-app.lovable.app
Custom Domain: https://your-domain.com (optional)
SSL: Automatically configured
CDN: Global distribution enabled
```

### 4. Production Configuration
```env
# Production environment variables
VITE_SUPABASE_URL=https://ylwajcnexpjwohmjeopj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=production
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID (if using Google Analytics)
```

### 5. Post-deployment Verification
```bash
# Health checks
curl -I https://your-app.lovable.app
# Should return 200 OK

# Performance testing
npm run lighthouse # If configured

# User acceptance testing
# Manual testing of critical user flows
```

## Custom Domain Setup

### 1. Domain Configuration
```bash
# In Lovable Dashboard
1. Go to Project Settings > Domains
2. Click "Connect Domain"
3. Enter your custom domain
4. Follow DNS configuration instructions
```

### 2. DNS Settings
```dns
# Add CNAME record to your DNS provider
Type: CNAME
Name: @ (or subdomain)
Value: your-app.lovable.app
TTL: 300 (5 minutes)
```

### 3. SSL Certificate
```
# Automatic SSL via Let's Encrypt
- Certificate provisioned automatically
- Auto-renewal enabled
- HTTPS enforcement enabled
```

### 4. Domain Verification
```bash
# Verify domain is working
nslookup your-domain.com
dig your-domain.com

# Test HTTPS
curl -I https://your-domain.com
```

## Environment Variables

### Application Variables
```env
# Required for all environments
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional configurations
VITE_ENVIRONMENT=development|staging|production
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

### Supabase Variables
```env
# Backend configuration (Supabase Dashboard)
JWT_SECRET=your_jwt_secret
SITE_URL=https://your-domain.com
ADDITIONAL_REDIRECT_URLS=https://staging.your-domain.com
```

### Security Considerations
```bash
# Never expose these in client-side code:
- Database passwords
- Service role keys
- Private API keys
- JWT secrets

# Safe for client-side (VITE_ prefix):
- Public Supabase URL
- Anon key (protected by RLS)
- Public analytics IDs
```

## Database Migrations

### 1. Migration Strategy
```sql
-- migrations/20240101000000_initial_schema.sql
-- Create tables with proper RLS policies
-- Add indexes for performance
-- Set up triggers for automation
```

### 2. Migration Execution
```bash
# For future database changes
1. Create migration file in supabase/migrations/
2. Test migration on staging database
3. Apply to production during maintenance window
4. Verify data integrity
```

### 3. Rollback Strategy
```sql
-- Always prepare rollback scripts
-- migrations/20240101000000_rollback.sql
-- Test rollback procedures on staging
-- Document rollback steps
```

### 4. Data Backup
```bash
# Automated backups via Supabase
- Daily automated backups
- Point-in-time recovery available
- Manual backup before major changes
```

## Monitoring and Analytics

### 1. Application Monitoring
```javascript
// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 2. Error Tracking
```javascript
// Error boundary implementation
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    console.error('Application error:', error, errorInfo);
  }
}
```

### 3. User Analytics
```javascript
// Google Analytics 4 (example)
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'Expense Tracker',
  page_location: window.location.href
});
```

### 4. Database Monitoring
- Supabase Dashboard provides built-in monitoring
- Query performance metrics
- Connection pool status
- Storage usage tracking

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Verify environment variables
echo $VITE_SUPABASE_URL
```

#### 2. Authentication Issues
```javascript
// Debug authentication state
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)

// Check session storage
console.log('Session:', localStorage.getItem('supabase.auth.token'))
```

#### 3. Database Connection Issues
```javascript
// Test database connection
const { data, error } = await supabase
  .from('profiles')
  .select('count(*)')
  
console.log('DB Connection:', error ? 'Failed' : 'Success')
```

#### 4. CORS Issues
```javascript
// Verify Supabase CORS settings
// In Supabase Dashboard > Settings > API
// Add your domain to allowed origins
```

### Performance Issues

#### 1. Slow Loading
```bash
# Analyze bundle size
npm run build --analyze

# Optimize images
# Use WebP format
# Implement lazy loading
```

#### 2. Memory Leaks
```javascript
// Clean up subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('transactions')
    .subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}, [])
```

### Security Issues

#### 1. RLS Policy Violations
```sql
-- Debug RLS policies
SELECT * FROM pg_policies WHERE tablename = 'transactions';

-- Test policy with specific user
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "user-uuid"}';
SELECT * FROM transactions;
```

#### 2. XSS Prevention
```javascript
// Sanitize user inputs
import DOMPurify from 'dompurify';

const cleanContent = DOMPurify.sanitize(userInput);
```

## Maintenance

### Regular Maintenance Tasks

#### Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify backup integrity
- [ ] Update dependencies (security patches)

#### Monthly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Database maintenance
- [ ] User feedback analysis

#### Quarterly
- [ ] Major dependency updates
- [ ] Architecture review
- [ ] Capacity planning
- [ ] Disaster recovery testing

### Backup Strategy
```bash
# Automated daily backups via Supabase
# Manual backups before major changes
# Test restore procedures quarterly
# Document recovery procedures
```

### Update Strategy
```bash
# Semantic versioning
# Major.Minor.Patch (e.g., 1.2.3)

# Update process
1. Test updates in development
2. Deploy to staging
3. User acceptance testing
4. Deploy to production during maintenance window
5. Monitor for issues
6. Rollback if necessary
```

### Support Procedures
```bash
# User support workflow
1. Issue reported via support channel
2. Triage severity (Critical/High/Medium/Low)
3. Assign to appropriate team member
4. Investigate and reproduce issue
5. Implement fix or workaround
6. Test fix in staging
7. Deploy fix to production
8. Follow up with user
9. Document for knowledge base
```

This deployment guide provides comprehensive instructions for deploying and maintaining the expense tracker application across different environments while ensuring security, performance, and reliability.
