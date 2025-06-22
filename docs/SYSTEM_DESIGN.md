
# System Design Document

## 1. System Architecture Overview

### 1.1 Architecture Style
The Expense Tracker follows a **Client-Server Architecture** with a **Single Page Application (SPA)** frontend and a **Backend-as-a-Service (BaaS)** backend.

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │   Mobile    │ │   Tablet    │ │   Desktop   │ │     PWA     ││
│  │   Browser   │ │   Browser   │ │   Browser   │ │    Mobile   ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                React Application                            ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           ││
│  │  │    Auth     │ │  Dashboard  │ │ Transactions│           ││
│  │  │ Components  │ │ Components  │ │ Components  │           ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │               React Context & Hooks                        ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           ││
│  │  │Transactions │ │    Auth     │ │    Query    │           ││
│  │  │  Context    │ │   Context   │ │   Hooks     │           ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  Supabase Client                           ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           ││
│  │  │    Auth     │ │  Database   │ │ Edge Funcs  │           ││
│  │  │   Client    │ │   Client    │ │   Client    │           ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Service Layer                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Supabase Services                        ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           ││
│  │  │    Auth     │ │   Database  │ │    Edge     │           ││
│  │  │   Service   │ │   Service   │ │  Functions  │           ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   PostgreSQL Database                      ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           ││
│  │  │   Tables    │ │   Indexes   │ │    RLS      │           ││
│  │  │ & Relations │ │ & Triggers  │ │  Policies   │           ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 System Components

#### Frontend Components
- **React Application**: Single-page application with TypeScript
- **UI Components**: shadcn/ui component library with Tailwind CSS
- **State Management**: React Context API for global state
- **Data Fetching**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation

#### Backend Components
- **Supabase Platform**: Backend-as-a-Service provider
- **PostgreSQL Database**: Relational database with ACID properties
- **Authentication Service**: JWT-based authentication with RLS
- **Edge Functions**: Serverless functions for custom logic
- **Real-time Subscriptions**: WebSocket connections for live updates

## 2. Data Flow Design

### 2.1 User Authentication Flow
```
User ──┐
       │ 1. Sign In/Up Request
       ▼
┌─────────────┐    2. Validate Credentials    ┌─────────────┐
│   AuthPage  │──────────────────────────────►│  Supabase   │
│ Component   │                               │    Auth     │
└─────────────┘    3. JWT Token + User Data   └─────────────┘
       │◄──────────────────────────────────────────────────┘
       │ 4. Store Session
       ▼
┌─────────────┐    5. Trigger Profile Creation ┌─────────────┐
│    Index    │──────────────────────────────►│  Database   │
│  Component  │                               │   Trigger   │
└─────────────┘    6. Profile Created         └─────────────┘
       │◄──────────────────────────────────────────────────┘
       │ 7. Render Dashboard
       ▼
┌─────────────┐
│  Dashboard  │
│ Components  │
└─────────────┘
```

### 2.2 Transaction Management Flow
```
User Input ──┐
             │ 1. Form Submission
             ▼
┌─────────────────┐    2. Validate Data    ┌─────────────────┐
│ AddTransaction  │────────────────────────►│  Form Schema    │
│     Modal       │                        │   Validation    │
└─────────────────┘    3. Validation Result└─────────────────┘
             │◄────────────────────────────────────────────┘
             │ 4. Call addTransaction
             ▼
┌─────────────────┐    5. Generate ID       ┌─────────────────┐
│  Transactions   │────────────────────────►│  New Transaction│
│    Context      │                        │     Object      │
└─────────────────┘    6. Add to State     └─────────────────┘
             │◄────────────────────────────────────────────┘
             │ 7. Update Components
             ▼
┌─────────────────┐    8. Re-render with    ┌─────────────────┐
│   Dashboard     │────────────────────────►│ TransactionsList│
│  Components     │      New Data          │   FinancialCharts│
└─────────────────┘                        └─────────────────┘
```

### 2.3 AI Features Data Flow
```
User Query ──┐
             │ 1. Chat Input
             ▼
┌─────────────────┐    2. Process Query     ┌─────────────────┐
│ FinanceChatBot  │────────────────────────►│  Query Analysis │
│   Component     │                        │    Function     │
└─────────────────┘    3. Generate Response └─────────────────┘
             │◄────────────────────────────────────────────┘
             │ 4. Add Message to State
             ▼
┌─────────────────┐    5. Analyze Transactions ┌─────────────────┐
│  AI Summary     │──────────────────────────►│  Transaction    │
│   Section       │                          │     Data        │
└─────────────────┘    6. Generate Insights   └─────────────────┘
             │◄──────────────────────────────────────────────┘
             │ 7. Display Results
             ▼
┌─────────────────┐
│   User          │
│  Interface      │
└─────────────────┘
```

## 3. Database Design

### 3.1 Current Schema Structure
```sql
-- User Profiles (Core table)
profiles {
  id: UUID (PK, FK to auth.users)
  email: TEXT
  full_name: TEXT
  avatar_url: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- Chat System
chats {
  id: UUID (PK)
  user_id: UUID (FK to profiles.id)
  title: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

messages {
  id: UUID (PK)
  chat_id: UUID (FK to chats.id)
  sender: TEXT
  content: TEXT
  created_at: TIMESTAMP
}
```

### 3.2 Required Schema for Full Functionality
```sql
-- Main Transactions Table
transactions {
  id: UUID (PK)
  user_id: UUID (FK to profiles.id)
  type: ENUM('income', 'expense', 'investment')
  amount: DECIMAL(10,2)
  description: TEXT
  category: TEXT
  subcategory: TEXT
  account: TEXT
  date: DATE
  note: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- Categories Management
categories {
  id: UUID (PK)
  name: TEXT
  type: ENUM('income', 'expense', 'investment')
  parent_id: UUID (FK to categories.id)
  user_id: UUID (FK to profiles.id)
  is_default: BOOLEAN
}

-- Accounts Management
accounts {
  id: UUID (PK)
  user_id: UUID (FK to profiles.id)
  name: TEXT
  type: ENUM('checking', 'savings', 'credit-card', 'investment', 'cash')
  balance: DECIMAL(10,2)
  is_active: BOOLEAN
}
```

### 3.3 Indexing Strategy
```sql
-- Performance Indexes
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_chats_user_created ON chats(user_id, created_at DESC);
```

## 4. Security Design

### 4.1 Authentication Architecture
```
┌─────────────┐    1. Login Request    ┌─────────────┐
│   Client    │──────────────────────►│  Supabase   │
│ Application │                       │    Auth     │
└─────────────┘                       └─────────────┘
       │                                      │
       │ 2. JWT Token                         │ 3. Verify Token
       │   + User Data                        │   with Database
       ▼                                      ▼
┌─────────────┐                       ┌─────────────┐
│   Browser   │                       │ PostgreSQL  │
│   Storage   │                       │  Database   │
└─────────────┘                       └─────────────┘
       │                                      │
       │ 4. Include Token in Requests         │ 5. Enforce RLS
       ▼                                      ▼
┌─────────────┐    6. Authorized Data  ┌─────────────┐
│ API Calls   │◄──────────────────────│ Row Level   │
│  to Backend │                       │  Security   │
└─────────────┘                       └─────────────┘
```

### 4.2 Row Level Security Policies
```sql
-- Example RLS Policy for Transactions
CREATE POLICY "users_own_transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Read Policy
CREATE POLICY "users_read_own_data" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Write Policy  
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

## 5. Performance Design

### 5.1 Frontend Performance Strategy
```
┌─────────────────────────────────────────────────────────┐
│                 Frontend Optimizations                  │
├─────────────────────────────────────────────────────────┤
│ • Code Splitting: Route-based chunks                   │
│ • Lazy Loading: Dynamic imports for components         │
│ • Memoization: React.memo for expensive renders        │
│ • Virtual Scrolling: Large transaction lists           │
│ • Image Optimization: WebP format, lazy loading        │
│ • Bundle Analysis: Tree shaking unused code            │
│ • Service Worker: Offline functionality                │
│ • Compression: Gzip/Brotli for static assets          │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Backend Performance Strategy
```
┌─────────────────────────────────────────────────────────┐
│                 Backend Optimizations                   │
├─────────────────────────────────────────────────────────┤
│ • Database Indexing: Query-specific indexes            │
│ • Connection Pooling: Efficient DB connections         │
│ • Query Optimization: Efficient SQL queries            │
│ • Caching: Edge caching for static content             │
│ • Rate Limiting: API abuse prevention                  │
│ • CDN: Global content delivery                         │
│ • Monitoring: Performance metrics tracking             │
│ • Auto-scaling: Dynamic resource allocation            │
└─────────────────────────────────────────────────────────┘
```

## 6. Scalability Design

### 6.1 Horizontal Scaling Strategy
```
Users: 1-1K        Users: 1K-10K       Users: 10K-100K     Users: 100K+
┌─────────────┐    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Single    │    │  Load       │     │  Multi-     │     │ Microservices│
│   Instance  │    │  Balancer   │     │  Region     │     │ Architecture │
│             │    │             │     │             │     │             │
│ ┌─────────┐ │    │ ┌─────────┐ │     │ ┌─────────┐ │     │ ┌─────────┐ │
│ │Frontend │ │    │ │Frontend │ │     │ │Frontend │ │     │ │ Service │ │
│ └─────────┘ │    │ └─────────┘ │     │ └─────────┘ │     │ │  Mesh   │ │
│ ┌─────────┐ │    │ ┌─────────┐ │     │ ┌─────────┐ │     │ └─────────┘ │
│ │Database │ │    │ │Database │ │     │ │Database │ │     │ ┌─────────┐ │
│ └─────────┘ │    │ └─────────┘ │     │ │Clusters │ │     │ │Event Bus│ │
└─────────────┘    └─────────────┘     │ └─────────┘ │     │ └─────────┘ │
                                       └─────────────┘     └─────────────┘
```

### 6.2 Data Scaling Strategy
```
Small Scale        Medium Scale        Large Scale         Enterprise Scale
(< 1GB data)       (1GB - 100GB)       (100GB - 1TB)      (> 1TB)
┌─────────────┐    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Single    │    │  Read       │     │ Horizontal  │     │  Distributed│
│  Database   │    │ Replicas    │     │ Sharding    │     │  Database   │
│             │    │             │     │             │     │             │
│ ┌─────────┐ │    │ ┌─────────┐ │     │ ┌─────────┐ │     │ ┌─────────┐ │
│ │PostgreSQL│ │    │ │ Master  │ │     │ │ Shard 1 │ │     │ │  Data   │ │
│ └─────────┘ │    │ └─────────┘ │     │ └─────────┘ │     │ │  Lake   │ │
└─────────────┘    │ ┌─────────┐ │     │ ┌─────────┐ │     │ └─────────┘ │
                   │ │ Replica │ │     │ │ Shard 2 │ │     │ ┌─────────┐ │
                   │ └─────────┘ │     │ └─────────┘ │     │ │Analytics│ │
                   └─────────────┘     └─────────────┘     │ │ Engine  │ │
                                                           └─────────────┘
```

## 7. Deployment Architecture

### 7.1 Environment Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                      Production Environment                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │   Lovable   │ │  Supabase   │ │     CDN     │ │ Monitoring  ││
│  │  Platform   │ │   Cloud     │ │  (Global)   │ │  & Alerts   ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Staging Environment                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  Preview    │ │  Supabase   │ │   Testing   │ │    QA       ││
│  │   URLs      │ │  Staging    │ │    Suite    │ │ Validation  ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Development Environment                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │   Local     │ │   Local     │ │    Hot      │ │   Debug     ││
│  │    Vite     │ │  Supabase   │ │  Reloading  │ │    Tools    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 CI/CD Pipeline
```
Developer ──┐
           │ 1. Code Commit
           ▼
┌─────────────┐    2. Trigger Build    ┌─────────────┐
│     Git     │──────────────────────►│   Lovable   │
│ Repository  │                       │   Platform  │
└─────────────┘    3. Auto Deploy     └─────────────┘
           │◄──────────────────────────────────────┘
           │ 4. Success/Failure
           ▼
┌─────────────┐    5. Run Tests       ┌─────────────┐
│  Automated  │──────────────────────►│   Testing   │
│    Tests    │                       │    Suite    │
└─────────────┘    6. Test Results    └─────────────┘
           │◄──────────────────────────────────────┘
           │ 7. Deploy to Production
           ▼
┌─────────────┐
│ Production  │
│Environment  │
└─────────────┘
```

This system design provides a comprehensive foundation for building a scalable, secure, and maintainable expense tracking application.
