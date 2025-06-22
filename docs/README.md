
# Expense Tracker Application Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Frontend Documentation](#frontend-documentation)
4. [Backend Documentation](#backend-documentation)
5. [Database Documentation](#database-documentation)
6. [System Design](#system-design)
7. [Diagrams](#diagrams)
8. [API Documentation](#api-documentation)
9. [Deployment Guide](#deployment-guide)

## System Overview

The Expense Tracker is a comprehensive personal finance management application built with React, TypeScript, and Supabase. It provides users with the ability to track income, expenses, and investments while offering AI-powered insights and financial advice.

### Key Features
- **Transaction Management**: Add, view, and categorize financial transactions
- **Financial Analytics**: Visual charts and spending analysis
- **AI-Powered Insights**: Automated financial summaries and recommendations
- **AI Chat Assistant**: Interactive financial advisor for personalized advice
- **Responsive Design**: Mobile-first approach with optimized UX
- **Authentication**: Secure user authentication and data isolation
- **Real-time Updates**: Live data synchronization across devices

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **UI Components**: shadcn/ui, Radix UI primitives
- **Charts**: Recharts for data visualization
- **Backend**: Supabase (PostgreSQL, Edge Functions, Auth)
- **State Management**: React Context API, TanStack Query
- **Authentication**: Supabase Auth with RLS policies
- **Deployment**: Lovable platform with automated CI/CD

## Architecture

The application follows a modern three-tier architecture:

1. **Presentation Layer**: React frontend with responsive UI
2. **Business Logic Layer**: React Context and custom hooks
3. **Data Layer**: Supabase backend with PostgreSQL database

### Design Patterns Used
- **Provider Pattern**: For state management (TransactionsContext)
- **Component Composition**: Reusable UI components
- **Custom Hooks**: For data fetching and business logic
- **Observer Pattern**: React's state management and re-rendering
- **Factory Pattern**: Component creation with consistent props

## Frontend Documentation

### Component Hierarchy
```
src/
├── components/
│   ├── auth/
│   │   └── AuthPage.tsx           # Authentication forms
│   ├── dashboard/
│   │   ├── Dashboard.tsx          # Main dashboard container
│   │   ├── TransactionsList.tsx   # Transaction display component
│   │   ├── FinancialCharts.tsx    # Data visualization
│   │   ├── DateRangeSelector.tsx  # Date filtering component
│   │   ├── AISummarySection.tsx   # AI-generated insights
│   │   └── FinanceChatBot.tsx     # AI chat interface
│   ├── transactions/
│   │   └── AddTransactionModal.tsx # Transaction creation form
│   └── ui/                        # Reusable UI components (shadcn/ui)
├── contexts/
│   └── TransactionsContext.tsx    # Global state management
├── data/
│   ├── mockData.ts               # Sample transaction data
│   └── categories.ts             # Transaction categories
├── pages/
│   ├── Index.tsx                 # Main application page
│   └── NotFound.tsx              # 404 error page
└── types/
    └── transaction.ts            # TypeScript type definitions
```

### Key Components

#### TransactionsContext
- **Purpose**: Global state management for transactions
- **Features**: Add transactions, maintain transaction list
- **State**: Array of transactions with CRUD operations

#### Dashboard
- **Purpose**: Main application interface
- **Features**: Transaction overview, charts, AI sections
- **Props**: User authentication state, logout handler

#### AddTransactionModal
- **Purpose**: Transaction creation interface
- **Features**: Form validation, category selection, account types
- **Integration**: Connected to TransactionsContext

### State Flow
1. User authenticates via AuthPage
2. TransactionsProvider wraps the application
3. Dashboard components consume transaction state
4. New transactions update global state
5. All components re-render with updated data

## Backend Documentation

### Supabase Configuration

#### Database Functions
```sql
-- User profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$function$
```

#### Row Level Security (RLS)
- All tables implement RLS policies
- Users can only access their own data
- Policies enforce data isolation by user_id

#### Authentication Flow
1. User signs up/in via Supabase Auth
2. Profile creation trigger fires
3. RLS policies enforce data access
4. Frontend receives authenticated session

## Database Documentation

### Current Schema

#### Tables Overview
- **profiles**: User profile information
- **chats**: Chat conversation metadata  
- **messages**: Chat message storage

### Required Schema for Full Functionality
```sql
-- Transactions table (needed for core functionality)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'investment')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  account TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own transactions"
ON public.transactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### Data Relationships
- profiles.id → transactions.user_id (1:many)
- profiles.id → chats.user_id (1:many)
- chats.id → messages.chat_id (1:many)

## System Design

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Database      │
│   React App     │◄──►│   Backend       │◄──►│   PostgreSQL    │
│                 │    │   (Auth/API)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow Architecture
```
User Input → Component → Context → Supabase Client → Database
         ◄─          ◄─        ◄─               ◄─
```

### Security Architecture
- Authentication: Supabase Auth (JWT tokens)
- Authorization: Row Level Security policies
- Data Validation: TypeScript + Zod schemas
- API Security: HTTPS, CORS policies

## Performance Considerations

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large transaction lists
- **Image Optimization**: Lazy loading and WebP format

### Backend Optimizations
- **Database Indexing**: Indexes on user_id and date columns
- **Query Optimization**: Efficient SQL with proper joins
- **Connection Pooling**: Supabase managed connections
- **Caching**: Browser caching for static assets

### Mobile Optimizations
- **Responsive Design**: Mobile-first CSS approach
- **Touch Interactions**: Optimized for mobile gestures
- **Progressive Web App**: Offline capabilities
- **Performance Budget**: Lighthouse score > 90

## Security Implementation

### Authentication Security
- **JWT Tokens**: Secure session management
- **Password Policies**: Strong password requirements
- **MFA Support**: Multi-factor authentication ready
- **Session Management**: Automatic token refresh

### Data Security
- **RLS Policies**: Database-level access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in Supabase protection

### API Security
- **Rate Limiting**: Supabase managed rate limits
- **CORS Policies**: Restricted domain access
- **HTTPS Only**: Encrypted data transmission
- **API Key Management**: Secure environment variables

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing with Jest

### Integration Testing
- API integration tests
- Database transaction tests
- Authentication flow tests

### E2E Testing
- User journey testing with Playwright/Cypress
- Cross-browser compatibility testing
- Mobile device testing

## Deployment Architecture

### Development Environment
- **Local Development**: Vite dev server
- **Database**: Local Supabase instance
- **Hot Reloading**: Instant feedback loop

### Production Environment
- **Hosting**: Lovable platform
- **Database**: Supabase cloud
- **CDN**: Global content delivery
- **Monitoring**: Built-in analytics

### CI/CD Pipeline
- **Version Control**: Git-based workflow
- **Automatic Deployment**: Push-to-deploy
- **Environment Variables**: Secure configuration
- **Rollback Strategy**: Instant rollback capability

## Monitoring and Analytics

### Application Monitoring
- **Error Tracking**: Runtime error capture
- **Performance Monitoring**: Core Web Vitals
- **User Analytics**: Usage patterns and engagement
- **Database Monitoring**: Query performance and usage

### Business Metrics
- **User Engagement**: Daily/monthly active users
- **Feature Usage**: Transaction creation rates
- **Performance Metrics**: Load times and responsiveness
- **Error Rates**: Application stability metrics
