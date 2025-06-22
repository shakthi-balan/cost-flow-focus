
# Sequence Diagrams

## 1. User Authentication Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant A as AuthPage
    participant S as Supabase Auth
    participant D as Database
    participant P as Profile Trigger
    participant I as Index Component
    
    Note over U,I: User Login Flow
    U->>B: Navigate to application
    B->>I: Load application
    I->>I: Check localStorage for auth
    I->>A: Render AuthPage (not authenticated)
    A->>U: Display login form
    
    U->>A: Enter email and password
    A->>A: Validate form inputs
    A->>S: supabase.auth.signInWithPassword()
    S->>D: Verify credentials
    
    alt Credentials Valid
        D-->>S: Return user data
        S-->>A: Success response with JWT
        A->>B: Store session in localStorage
        A->>I: Call onAuth() callback
        I->>I: Set isAuthenticated = true
        I->>U: Render Dashboard
    else Credentials Invalid
        D-->>S: Authentication failed
        S-->>A: Error response
        A->>U: Display error message
    end
```

## 2. User Registration Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant A as AuthPage
    participant S as Supabase Auth
    participant D as Database
    participant T as Database Trigger
    participant P as Profiles Table
    participant I as Index Component
    
    Note over U,I: User Registration Flow
    U->>A: Click "Sign Up" tab
    A->>U: Display registration form
    U->>A: Enter name, email, password
    A->>A: Validate form inputs
    A->>S: supabase.auth.signUp()
    S->>D: Create new user in auth.users
    
    alt Registration Successful
        D-->>T: Trigger handle_new_user()
        T->>P: INSERT INTO profiles table
        P-->>T: Profile created
        T-->>D: Trigger completed
        D-->>S: User created successfully
        S-->>A: Success response
        A->>I: Call onAuth() callback
        I->>I: Set isAuthenticated = true
        I->>U: Render Dashboard with welcome
    else Registration Failed
        D-->>S: Error (email exists, weak password, etc.)
        S-->>A: Error response
        A->>U: Display error message
    end
```

## 3. Transaction Creation Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant B as FloatingButton
    participant M as AddTransactionModal
    participant F as Form Component
    participant C as TransactionsContext
    participant L as Local State
    participant UI as UI Components
    
    Note over U,UI: Add Transaction Flow
    U->>B: Click floating + button
    B->>M: Set showAddModal = true
    M->>U: Display transaction form modal
    
    U->>F: Fill transaction details
    F->>F: Update form state
    U->>F: Select transaction type
    F->>F: Update category options
    U->>F: Select category/subcategory
    U->>F: Enter amount and description
    U->>F: Select account and date
    U->>F: Add optional notes
    
    U->>F: Click "Add Transaction"
    F->>F: Validate form data
    
    alt Form Valid
        F->>C: Call addTransaction(transactionData)
        C->>C: Generate unique ID
        C->>C: Create Transaction object
        C->>L: Add to transactions array
        L-->>C: State updated
        C-->>F: Success callback
        F->>M: Close modal
        M->>UI: Trigger re-render
        UI->>U: Show updated transaction list
        UI->>U: Display success toast
    else Form Invalid
        F->>U: Display validation errors
        U->>F: Correct form errors
    end
```

## 4. Dashboard Data Loading Sequence

```mermaid
sequ encediagram
    participant U as User
    participant D as Dashboard
    participant C as TransactionsContext
    participant TL as TransactionsList
    participant FC as FinancialCharts
    participant AS as AISummarySection
    participant CB as ChatBot
    participant M as Mock Data
    
    Note over U,M: Dashboard Loading Flow
    U->>D: Navigate to dashboard
    D->>C: useTransactions() hook
    C->>M: Load mockTransactions
    M-->>C: Return transaction array
    C-->>D: Provide transactions context
    
    par Parallel Component Loading
        D->>TL: Pass transactions prop
        TL->>TL: Sort and format transactions
        TL->>U: Render transaction list
    and
        D->>FC: Pass transactions prop
        FC->>FC: Process data for charts
        FC->>FC: Generate chart data
        FC->>U: Render financial charts
    and
        D->>AS: Pass transactions prop
        AS->>AS: Calculate financial metrics
        AS->>AS: Generate AI insights
        AS->>U: Render summary section
    and
        D->>CB: Pass transactions prop
        CB->>CB: Initialize chat state
        CB->>U: Render chat interface
    end
    
    Note over D,U: All components loaded
    D->>U: Dashboard fully rendered
```

## 5. AI Summary Generation Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant AS as AISummarySection
    participant T as Transactions Data
    participant AI as AI Processing
    participant S as Summary State
    participant UI as UI Display
    
    Note over U,UI: AI Summary Generation Flow
    U->>AS: Component mounts or data changes
    AS->>AS: useEffect triggered
    AS->>S: Set isGenerating = true
    AS->>UI: Show loading skeleton
    
    AS->>T: Get transactions array
    T-->>AS: Return transaction data
    AS->>AI: Call generateSummary()
    
    AI->>AI: Calculate total income
    AI->>AI: Calculate total expenses
    AI->>AI: Calculate savings
    AI->>AI: Calculate savings rate
    AI->>AI: Analyze spending categories
    AI->>AI: Generate insights array
    
    Note over AI: Simulate AI processing delay
    AI->>AI: setTimeout(2000ms)
    
    AI-->>AS: Return summary and insights
    AS->>S: Set summary text
    AS->>S: Set insights array
    AS->>S: Set isGenerating = false
    AS->>UI: Render generated content
    UI->>U: Display AI summary and insights
    
    Note over U,UI: User can refresh summary
    U->>AS: Click refresh button
    AS->>AI: Regenerate summary
    AI-->>AS: New summary generated
    AS->>UI: Update display
```

## 6. AI Chat Interaction Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant CB as ChatBot Component
    participant M as Messages State
    participant I as Input Handler
    participant AI as AI Response Generator
    participant T as Transaction Data
    participant UI as Chat UI
    
    Note over U,UI: AI Chat Interaction Flow
    U->>CB: Component loads
    CB->>M: Initialize with welcome message
    CB->>UI: Display chat interface
    
    U->>I: Type financial question
    I->>I: Update inputMessage state
    U->>I: Press Enter or click Send
    
    I->>M: Add user message to messages array
    I->>I: Clear input field
    I->>UI: Show typing indicator
    
    I->>T: Get current transactions
    T-->>I: Return transactions data
    I->>AI: Call generateBotResponse(userMessage)
    
    AI->>AI: Analyze user query
    alt Query about spending
        AI->>T: Calculate total expenses
        AI->>AI: Generate spending advice
    else Query about income
        AI->>T: Calculate total income
        AI->>AI: Generate income insights
    else Query about budget
        AI->>AI: Generate budget recommendations
    else Query about investments
        AI->>T: Calculate total investments
        AI->>AI: Generate investment advice
    else General query
        AI->>AI: Generate general financial advice
    end
    
    Note over AI: Simulate thinking time
    AI->>AI: setTimeout(1500ms)
    
    AI-->>I: Return generated response
    I->>M: Add AI message to messages array
    I->>UI: Hide typing indicator
    UI->>U: Display AI response
    
    Note over U,UI: Conversation continues
    U->>I: Ask follow-up question
    Note over I,AI: Process continues with conversation context
```

## 7. Date Range Filtering Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant DS as DateRangeSelector
    participant D as Dashboard
    participant C as Components
    participant F as Filter Logic
    participant UI as UI Update
    
    Note over U,UI: Date Range Filtering Flow
    U->>DS: Interact with date selector
    DS->>DS: Handle date type change
    
    alt Monthly View Selected
        U->>DS: Select month input
        DS->>DS: handleMonthChange(month)
        DS->>DS: Calculate start/end dates
        DS->>D: onDateRangeChange({start, end, type: 'month'})
    else Custom Range Selected
        U->>DS: Click start date picker
        DS->>U: Show calendar popup
        U->>DS: Select start date
        DS->>DS: setStartDate(date)
        U->>DS: Click end date picker
        DS->>U: Show calendar popup
        U->>DS: Select end date
        DS->>DS: setEndDate(date)
        DS->>DS: handleCustomDateChange()
        DS->>D: onDateRangeChange({start, end, type: 'custom'})
    end
    
    D->>F: Apply date filter to data
    F->>F: Filter transactions by date range
    F-->>D: Return filtered data
    
    par Update All Components
        D->>C: Pass filtered data to charts
        C->>UI: Re-render charts with filtered data
    and
        D->>C: Pass filtered data to AI summary
        C->>UI: Re-generate AI insights
    and
        D->>C: Pass filtered data to transaction list
        C->>UI: Update transaction display
    end
    
    UI->>U: Display filtered results
```

## 8. Mobile Navigation Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant M as Mobile Device
    participant D as Dashboard
    participant N as Navigation
    participant C as Components
    participant L as Layout Manager
    
    Note over U,L: Mobile Navigation Flow
    U->>M: Access app on mobile device
    M->>D: Detect mobile viewport
    D->>L: Apply mobile layout classes
    L->>N: Configure mobile navigation
    
    U->>N: Swipe or tap navigation
    N->>N: Handle touch gestures
    
    alt Menu Toggle
        U->>N: Tap hamburger menu
        N->>N: Toggle mobile menu
        N->>C: Show/hide navigation items
    else Section Scroll
        U->>D: Scroll vertically
        D->>C: Collapse/expand sections
        C->>L: Adjust component heights
    else Quick Action
        U->>D: Tap floating action button
        D->>C: Open add transaction modal
        C->>L: Overlay modal on screen
    end
    
    L->>M: Apply responsive styles
    M->>U: Display optimized mobile UI
    
    Note over U,L: Touch interactions optimized
    U->>C: Touch interactions
    C->>C: Handle touch events
    C->>U: Provide haptic feedback
```

## 9. Error Handling Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant E as Error Boundary
    participant H as Error Handler
    participant L as Logger
    participant UI as User Interface
    participant T as Toast System
    
    Note over U,T: Error Handling Flow
    U->>C: Perform action (e.g., add transaction)
    C->>C: Execute operation
    
    alt Operation Successful
        C->>UI: Update interface
        UI->>U: Show success state
    else Operation Fails
        C->>E: Throw error
        E->>E: componentDidCatch()
        E->>H: Handle error
        
        H->>L: Log error details
        L->>L: Send to monitoring service
        
        H->>H: Determine error type
        alt Network Error
            H->>T: Show network error toast
            T->>U: "Please check your connection"
        else Validation Error
            H->>UI: Show field-specific errors
            UI->>U: Highlight invalid fields
        else Authentication Error
            H->>C: Redirect to login
            C->>U: Show login page
        else Generic Error
            H->>T: Show generic error message
            T->>U: "Something went wrong"
        end
        
        H->>UI: Show retry option
        UI->>U: Display "Try Again" button
        
        alt User Retries
            U->>C: Click "Try Again"
            C->>C: Retry original operation
        else User Dismisses
            U->>UI: Dismiss error
            UI->>C: Return to previous state
        end
    end
```

## 10. Data Synchronization Sequence (Future Implementation)

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant L as Local State
    participant S as Supabase Client
    participant D as Database
    participant R as Realtime
    participant O as Other Clients
    
    Note over U,O: Data Sync Flow (Future)
    U->>C: Create transaction
    C->>L: Optimistic update
    L->>U: Show immediate feedback
    
    par Sync to Server
        C->>S: Insert transaction
        S->>D: Save to database
        D-->>S: Confirm saved
        S-->>C: Success response
        C->>L: Confirm optimistic update
    and Real-time Broadcast
        D->>R: Notify change
        R->>O: Broadcast to other clients
        O->>O: Update their local state
    end
    
    alt Sync Successful
        C->>U: Show success indicator
    else Sync Failed
        S-->>C: Error response
        C->>L: Revert optimistic update
        C->>U: Show error message
        C->>U: Offer retry option
        
        alt User Retries
            U->>C: Retry sync
            C->>S: Retry insert
        else User Accepts Local Only
            U->>C: Continue with local data
            C->>C: Queue for background sync
        end
    end
    
    Note over C,D: Background Sync
    C->>C: Check connectivity
    C->>S: Sync queued changes
    S->>D: Batch update
    D-->>S: Confirm batch
    S-->>C: Sync complete
```

## 11. Performance Optimization Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant M as Memoization
    participant L as Lazy Loader
    participant Cache as Cache Manager
    participant P as Performance Monitor
    
    Note over U,P: Performance Optimization Flow
    U->>C: Navigate to dashboard
    C->>P: Start timing measurement
    
    C->>Cache: Check for cached data
    alt Cache Hit
        Cache-->>C: Return cached data
        C->>M: Use memoized components
        M-->>C: Skip re-computation
    else Cache Miss
        C->>L: Load required data
        L->>L: Fetch from source
        L-->>C: Return fresh data
        C->>Cache: Store in cache
        C->>M: Memoize heavy computations
    end
    
    C->>L: Lazy load non-critical components
    L->>L: Load components on demand
    
    par Preload Next Route
        C->>L: Prefetch likely next page
    and Background Optimization
        C->>Cache: Cleanup expired entries
        C->>M: Update memoization cache
    end
    
    C->>P: End timing measurement
    P->>P: Record performance metrics
    C->>U: Render optimized interface
    
    Note over U,P: Continuous monitoring
    P->>P: Monitor Core Web Vitals
    P->>P: Track user interactions
    P->>P: Report performance data
```

These sequence diagrams provide detailed insights into the temporal behavior and interactions between different components of the expense tracker application, covering both current functionality and future enhancements.
