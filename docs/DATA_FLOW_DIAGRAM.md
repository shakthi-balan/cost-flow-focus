
# Data Flow Diagrams

## 1. High-Level System Data Flow

```mermaid
graph TD
    A[User] --> B[React Frontend]
    B --> C[Supabase Client]
    C --> D[Supabase Backend]
    D --> E[PostgreSQL Database]
    E --> D
    D --> C
    C --> B
    B --> A
    
    F[AI Services] --> B
    G[External APIs] --> D
    H[Authentication] --> D
    I[File Storage] --> D
```

## 2. User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant D as Database
    
    U->>F: Enter credentials
    F->>A: Submit login request
    A->>D: Validate user
    D-->>A: User data
    A-->>F: JWT token + user data
    F->>F: Store session
    F->>D: Trigger profile creation
    D-->>F: Profile created
    F-->>U: Dashboard rendered
```

## 3. Transaction Management Flow

```mermaid
graph LR
    A[User Input] --> B[Form Validation]
    B --> C[TransactionContext]
    C --> D[Generate ID]
    D --> E[Add to State]
    E --> F[Update Components]
    F --> G[TransactionsList]
    F --> H[FinancialCharts]
    F --> I[AISummary]
    
    subgraph "Context State"
        C
        E
    end
    
    subgraph "UI Components"
        G
        H
        I
    end
```

## 4. AI Features Data Flow

```mermaid
graph TD
    A[User Query] --> B[Chat Component]
    B --> C[Process Query]
    C --> D[Analyze Transactions]
    D --> E[Generate Response]
    E --> F[Update Chat State]
    F --> G[Display Response]
    
    H[Transaction Data] --> D
    I[AI Summary Trigger] --> J[Calculate Metrics]
    J --> K[Generate Insights]
    K --> L[Update Summary]
```

## 5. Component Communication Flow

```mermaid
graph TB
    A[App.tsx] --> B[Index.tsx]
    B --> C[TransactionsProvider]
    C --> D[Dashboard]
    
    D --> E[TransactionsList]
    D --> F[FinancialCharts]
    D --> G[AISummarySection]
    D --> H[FinanceChatBot]
    D --> I[DateRangeSelector]
    
    J[AddTransactionModal] --> C
    
    subgraph "Context Flow"
        C --> K[transactions state]
        C --> L[addTransaction method]
        K --> E
        K --> F
        K --> G
        L --> J
    end
```

## 6. Database Transaction Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant C as Context
    participant S as Supabase Client
    participant D as Database
    participant R as RLS Engine
    
    F->>C: addTransaction(data)
    C->>C: Generate ID
    C->>C: Add to local state
    Note over C: Future: Sync with DB
    C->>S: INSERT transaction
    S->>R: Check RLS policy
    R->>D: Execute if authorized
    D-->>S: Success/Error
    S-->>C: Result
    C-->>F: State updated
```

## 7. Real-time Data Synchronization

```mermaid
graph LR
    A[User A Action] --> B[Database Update]
    B --> C[Supabase Realtime]
    C --> D[WebSocket Push]
    D --> E[User B Frontend]
    E --> F[Component Re-render]
    
    G[User B Action] --> B
    H[Background Sync] --> B
```

## 8. Error Handling Flow

```mermaid
graph TD
    A[User Action] --> B[Try Operation]
    B --> C{Success?}
    C -->|Yes| D[Update State]
    C -->|No| E[Catch Error]
    E --> F[Log Error]
    F --> G[Show User Message]
    G --> H[Retry Option]
    H --> B
    
    D --> I[Notify Success]
```

## 9. Mobile vs Desktop Flow

```mermaid
graph LR
    A[User Device] --> B{Screen Size?}
    B -->|Mobile| C[Compact Layout]
    B -->|Desktop| D[Full Layout]
    
    C --> E[Touch Interactions]
    C --> F[Mobile Menu]
    C --> G[Swipe Gestures]
    
    D --> H[Mouse Interactions]
    D --> I[Full Navigation]
    D --> J[Hover States]
    
    subgraph "Responsive Components"
        E
        F
        G
        H
        I
        J
    end
```

## 10. State Management Flow

```mermaid
graph TB
    A[Initial State] --> B[User Action]
    B --> C[Dispatch Action]
    C --> D[Context Update]
    D --> E[Component Re-render]
    E --> F[UI Update]
    
    subgraph "React Context"
        G[TransactionsContext]
        H[transactions: Transaction[]]
        I[addTransaction: Function]
        G --> H
        G --> I
    end
    
    C --> G
```

## 11. Security Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth
    participant R as RLS
    participant D as Database
    
    U->>F: Request data
    F->>A: Include JWT token
    A->>R: Validate token
    R->>R: Check user permissions
    R->>D: Filter data by user_id
    D-->>R: User's data only
    R-->>A: Authorized data
    A-->>F: Secure response
    F-->>U: Display data
```

## 12. Performance Optimization Flow

```mermaid
graph LR
    A[User Request] --> B[Check Cache]
    B --> C{Cache Hit?}
    C -->|Yes| D[Return Cached]
    C -->|No| E[Fetch Data]
    E --> F[Update Cache]
    F --> G[Return Data]
    
    H[Background] --> I[Prefetch Common Data]
    J[User Interaction] --> K[Preload Next Route]
    L[Component Mount] --> M[Lazy Load Images]
```

## Data Flow Summary

### Key Patterns:
1. **Unidirectional Data Flow**: Data flows down through components via props and context
2. **Event-Driven Updates**: User actions trigger state changes that propagate through the system
3. **Security-First**: All data access goes through authentication and authorization layers
4. **Optimistic Updates**: UI updates immediately while syncing with backend
5. **Error Boundaries**: Graceful error handling at multiple levels
6. **Performance Optimized**: Caching, lazy loading, and efficient re-rendering

### Critical Paths:
1. **Authentication**: Login → Token → Session → Protected Routes
2. **Transaction Creation**: Form → Validation → Context → UI Update
3. **Data Synchronization**: Local State ↔ Database ↔ Real-time Updates
4. **AI Processing**: User Query → Analysis → Response Generation → Display

This data flow design ensures efficient, secure, and user-friendly operation of the expense tracker application.
