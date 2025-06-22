
# UML Diagrams

## 1. Use Case Diagram

```mermaid
graph LR
    User((User))
    Admin((Admin))
    System[Expense Tracker System]
    
    User --> UC1[Register Account]
    User --> UC2[Login]
    User --> UC3[Add Transaction]
    User --> UC4[View Transactions]
    User --> UC5[View Charts]
    User --> UC6[Filter by Date]
    User --> UC7[Get AI Summary]
    User --> UC8[Chat with AI]
    User --> UC9[Logout]
    User --> UC10[Update Profile]
    
    Admin --> UC11[Manage Users]
    Admin --> UC12[View System Analytics]
    Admin --> UC13[Monitor Performance]
    
    UC1 --> System
    UC2 --> System
    UC3 --> System
    UC4 --> System
    UC5 --> System
    UC6 --> System
    UC7 --> System
    UC8 --> System
    UC9 --> System
    UC10 --> System
    UC11 --> System
    UC12 --> System
    UC13 --> System
    
    System --> EXT1[Supabase Auth]
    System --> EXT2[PostgreSQL DB]
    System --> EXT3[AI Service]
```

## 2. Activity Diagram - Transaction Creation

```mermaid
graph TD
    Start([User clicks Add Transaction]) --> OpenModal[Open Transaction Modal]
    OpenModal --> SelectType[Select Transaction Type]
    SelectType --> EnterAmount[Enter Amount]
    EnterAmount --> EnterDesc[Enter Description]
    EnterDesc --> SelectCategory[Select Category]
    SelectCategory --> SelectSubcat[Select Subcategory]
    SelectSubcat --> SelectAccount[Select Account]
    SelectAccount --> SelectDate[Select Date]
    SelectDate --> EnterNotes[Enter Notes (Optional)]
    EnterNotes --> ValidateForm{Form Valid?}
    ValidateForm -->|No| ShowError[Show Validation Error]
    ShowError --> SelectType
    ValidateForm -->|Yes| SubmitForm[Submit Form]
    SubmitForm --> GenerateID[Generate Transaction ID]
    GenerateID --> AddToContext[Add to Transactions Context]
    AddToContext --> UpdateUI[Update UI Components]
    UpdateUI --> CloseModal[Close Modal]
    CloseModal --> ShowSuccess[Show Success Message]
    ShowSuccess --> End([End])
```

## 3. Sequence Diagram - User Authentication

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as AuthPage
    participant S as Supabase Auth
    participant D as Database
    participant P as Profile Service
    
    U->>F: Access Application
    F->>F: Check Auth State
    F->>A: Render AuthPage
    A->>U: Display Login Form
    U->>A: Enter Credentials
    A->>A: Validate Input
    A->>S: Submit Login Request
    S->>D: Verify Credentials
    D-->>S: User Data
    S->>P: Trigger Profile Creation
    P->>D: Create/Update Profile
    D-->>P: Profile Created
    P-->>S: Profile Ready
    S-->>A: Auth Success + JWT
    A->>F: Update Auth State
    F->>F: Store Session
    F->>U: Redirect to Dashboard
    
    Note over U,D: Alternative: Registration Flow
    U->>A: Click Sign Up
    A->>U: Display Registration Form
    U->>A: Enter New User Data
    A->>S: Submit Registration
    S->>D: Create New User
    D-->>S: User Created
    S->>P: Auto-create Profile
    P->>D: Insert Profile Record
    D-->>P: Profile Inserted
    P-->>S: Profile Ready
    S-->>A: Registration Success
    A->>F: Update Auth State
    F->>U: Welcome to Dashboard
```

## 4. State Diagram - Application States

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Unauthenticated : Auth Check Complete
    Loading --> Authenticated : User Session Found
    
    Unauthenticated --> Login : User Chooses Login
    Unauthenticated --> Signup : User Chooses Signup
    
    Login --> Authenticating : Submit Credentials
    Signup --> Authenticating : Submit Registration
    
    Authenticating --> Authenticated : Success
    Authenticating --> Error : Authentication Failed
    
    Error --> Login : Retry Login
    Error --> Signup : Try Signup
    
    Authenticated --> Dashboard : Load Dashboard
    
    Dashboard --> AddingTransaction : Click Add Button
    Dashboard --> ViewingCharts : Navigate to Charts
    Dashboard --> UsingAI : Interact with AI
    Dashboard --> FilteringData : Apply Filters
    
    AddingTransaction --> Dashboard : Transaction Added
    AddingTransaction --> Error : Validation Failed
    
    ViewingCharts --> Dashboard : Back to Dashboard
    
    UsingAI --> AIChatting : Start Chat
    UsingAI --> AIAnalyzing : Generate Summary
    
    AIChatting --> UsingAI : End Chat
    AIAnalyzing --> UsingAI : Summary Complete
    
    FilteringData --> Dashboard : Filters Applied
    
    Dashboard --> Unauthenticated : Logout
    
    Error --> Dashboard : Error Resolved
```

## 5. Component Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        subgraph "React Application"
            App[App Component]
            Index[Index Component]
            Auth[AuthPage Component]
            Dashboard[Dashboard Component]
            
            subgraph "Feature Components"
                TransList[TransactionsList]
                Charts[FinancialCharts]
                AISum[AISummarySection]
                AIChat[FinanceChatBot]
                DateSel[DateRangeSelector]
                AddModal[AddTransactionModal]
            end
            
            subgraph "Context Layer"
                TransCtx[TransactionsContext]
                AuthCtx[Auth Context]
            end
            
            subgraph "UI Components"
                Button[Button]
                Card[Card]
                Input[Input]
                Modal[Modal]
                Select[Select]
            end
        end
        
        subgraph "Utilities"
            Utils[Date/Currency Utils]
            Validation[Form Validation]
            Charts_Utils[Chart Processing]
        end
    end
    
    subgraph "API Layer"
        SupaClient[Supabase Client]
        QueryClient[TanStack Query]
    end
    
    subgraph "Backend Layer"
        subgraph "Supabase Services"
            AuthService[Auth Service]
            DBService[Database Service]
            EdgeFuncs[Edge Functions]
            RealtimeService[Realtime Service]
        end
        
        subgraph "Database"
            PostgreSQL[(PostgreSQL)]
            RLS[Row Level Security]
            Triggers[Database Triggers]
        end
    end
    
    App --> Index
    Index --> Auth
    Index --> Dashboard
    Index --> TransCtx
    
    Dashboard --> TransList
    Dashboard --> Charts
    Dashboard --> AISum
    Dashboard --> AIChat
    Dashboard --> DateSel
    
    Index --> AddModal
    
    TransCtx --> TransList
    TransCtx --> Charts
    TransCtx --> AISum
    
    TransList --> Card
    Charts --> Utils
    AISum --> Charts_Utils
    AddModal --> Button
    AddModal --> Input
    AddModal --> Select
    AddModal --> Validation
    
    App --> SupaClient
    SupaClient --> AuthService
    SupaClient --> DBService
    SupaClient --> RealtimeService
    
    AuthService --> PostgreSQL
    DBService --> PostgreSQL
    DBService --> RLS
    EdgeFuncs --> PostgreSQL
    PostgreSQL --> Triggers
```

## 6. Deployment Diagram

```mermaid
graph TB
    subgraph "User Devices"
        Mobile[📱 Mobile Browser]
        Desktop[💻 Desktop Browser]
        Tablet[📟 Tablet Browser]
    end
    
    subgraph "CDN Layer"
        CloudFlare[☁️ Global CDN]
        EdgeCache[🔄 Edge Caching]
    end
    
    subgraph "Frontend Infrastructure"
        subgraph "Lovable Platform"
            WebServer[🌐 Web Server]
            StaticAssets[📁 Static Assets]
            BuildPipeline[🔧 Build Pipeline]
        end
    end
    
    subgraph "Backend Infrastructure"
        subgraph "Supabase Cloud"
            APIGateway[🚪 API Gateway]
            
            subgraph "Compute Layer"
                EdgeFunctions[⚡ Edge Functions]
                AuthService[🔐 Auth Service]
                RealtimeEngine[📡 Realtime Engine]
            end
            
            subgraph "Data Layer"
                PostgreSQL[🗄️ PostgreSQL]
                Backup[💾 Automated Backups]
                Monitoring[📊 DB Monitoring]
            end
            
            subgraph "Security Layer"
                RLS[🛡️ Row Level Security]
                JWT[🎫 JWT Tokens]
                SSL[🔒 SSL/TLS]
            end
        end
    end
    
    subgraph "External Services"
        OpenAI[🤖 OpenAI API]
        EmailService[📧 Email Service]
        Analytics[📈 Analytics Service]
    end
    
    Mobile --> CloudFlare
    Desktop --> CloudFlare
    Tablet --> CloudFlare
    
    CloudFlare --> EdgeCache
    EdgeCache --> WebServer
    
    WebServer --> StaticAssets
    WebServer --> APIGateway
    
    APIGateway --> EdgeFunctions
    APIGateway --> AuthService
    APIGateway --> RealtimeEngine
    
    EdgeFunctions --> PostgreSQL
    AuthService --> PostgreSQL
    RealtimeEngine --> PostgreSQL
    
    PostgreSQL --> Backup
    PostgreSQL --> Monitoring
    
    RLS --> PostgreSQL
    JWT --> AuthService
    SSL --> APIGateway
    
    EdgeFunctions --> OpenAI
    AuthService --> EmailService
    WebServer --> Analytics
    
    BuildPipeline --> WebServer
```

## 7. Class Diagram - Core Domain

```mermaid
classDiagram
    class User {
        +string id
        +string email
        +string fullName
        +string avatarUrl
        +Date createdAt
        +Date updatedAt
        +login()
        +logout()
        +updateProfile()
    }
    
    class Transaction {
        +string id
        +string userId
        +TransactionType type
        +number amount
        +string description
        +string category
        +string subcategory
        +string account
        +Date date
        +string note
        +Date createdAt
        +Date updatedAt
        +validate()
        +format()
    }
    
    class Category {
        +string id
        +string name
        +TransactionType type
        +string[] subcategories
        +string userId
        +boolean isDefault
        +addSubcategory()
        +removeSubcategory()
    }
    
    class Account {
        +string id
        +string userId
        +string name
        +AccountType type
        +number balance
        +boolean isActive
        +Date createdAt
        +updateBalance()
        +activate()
        +deactivate()
    }
    
    class AIChat {
        +string id
        +string userId
        +string title
        +Message[] messages
        +Date createdAt
        +Date updatedAt
        +addMessage()
        +generateResponse()
        +clearHistory()
    }
    
    class Message {
        +string id
        +string chatId
        +string content
        +MessageSender sender
        +Date timestamp
        +format()
    }
    
    class FinancialSummary {
        +string userId
        +DateRange period
        +number totalIncome
        +number totalExpenses
        +number totalInvestments
        +number savingsRate
        +Insight[] insights
        +calculate()
        +generateInsights()
    }
    
    class Insight {
        +string id
        +InsightType type
        +string title
        +string description
        +number impact
        +string[] recommendations
        +format()
    }
    
    User ||--o{ Transaction : owns
    User ||--o{ Category : creates
    User ||--o{ Account : manages
    User ||--o{ AIChat : initiates
    Transaction }o--|| Category : belongs_to
    Transaction }o--|| Account : from
    AIChat ||--o{ Message : contains
    User ||--|| FinancialSummary : has
    FinancialSummary ||--o{ Insight : generates
    
    <<enumeration>> TransactionType
    TransactionType : income
    TransactionType : expense
    TransactionType : investment
    
    <<enumeration>> AccountType
    AccountType : checking
    AccountType : savings
    AccountType : credit_card
    AccountType : investment
    AccountType : cash
    
    <<enumeration>> MessageSender
    MessageSender : user
    MessageSender : ai
    
    <<enumeration>> InsightType
    InsightType : positive
    InsightType : negative
    InsightType : neutral
```

## 8. Sequence Diagram - AI Chat Interaction

```mermaid
sequenceDiagram
    participant U as User
    participant C as ChatBot Component
    participant A as AI Service
    participant T as Transaction Context
    participant D as Database
    
    U->>C: Type question about finances
    C->>C: Update input state
    U->>C: Click send button
    C->>C: Add user message to state
    C->>C: Show typing indicator
    C->>T: Get current transactions
    T-->>C: Return transactions array
    C->>A: Process query with transaction data
    A->>A: Analyze spending patterns
    A->>A: Generate personalized response
    A-->>C: Return AI response
    C->>C: Add AI message to state
    C->>C: Hide typing indicator
    C->>U: Display AI response
    
    Note over U,D: Optional: Save chat history
    C->>D: Save chat session
    D-->>C: Confirm saved
    
    Note over U,D: Follow-up question
    U->>C: Ask follow-up question
    C->>A: Process with context
    A->>A: Use previous conversation context
    A-->>C: Contextual response
    C->>U: Display follow-up response
```

## 9. Activity Diagram - Data Analysis Flow

```mermaid
graph TD
    Start([User Opens Dashboard]) --> LoadData[Load Transaction Data]
    LoadData --> CheckCache{Data in Cache?}
    CheckCache -->|Yes| UseCache[Use Cached Data]
    CheckCache -->|No| FetchDB[Fetch from Database]
    FetchDB --> CacheData[Cache Data]
    CacheData --> UseCache
    UseCache --> ProcessCharts[Process Chart Data]
    ProcessCharts --> RenderCharts[Render Financial Charts]
    
    UseCache --> ProcessSummary[Calculate Summary Metrics]
    ProcessSummary --> GenerateInsights[Generate AI Insights]
    GenerateInsights --> RenderSummary[Render AI Summary]
    
    RenderCharts --> CheckFilters{Date Filters Applied?}
    CheckFilters -->|Yes| FilterData[Filter Data by Date Range]
    CheckFilters -->|No| DisplayAll[Display All Data]
    FilterData --> UpdateCharts[Update Chart Visualizations]
    DisplayAll --> UpdateCharts
    
    RenderSummary --> CheckTrigger{Auto-refresh Trigger?}
    CheckTrigger -->|Yes| RefreshData[Refresh Data]
    CheckTrigger -->|No| DisplaySummary[Display Current Summary]
    RefreshData --> LoadData
    DisplaySummary --> End([End])
    UpdateCharts --> End
```

## 10. Package Diagram

```mermaid
graph TB
    subgraph "Application Packages"
        subgraph "Presentation Layer"
            Components[components/]
            Pages[pages/]
            Hooks[hooks/]
            Styles[styles/]
        end
        
        subgraph "Business Logic Layer"
            Contexts[contexts/]
            Services[services/]
            Utils[utils/]
            Types[types/]
        end
        
        subgraph "Data Access Layer"
            Integrations[integrations/]
            API[api/]
            Storage[storage/]
        end
        
        subgraph "Configuration Layer"
            Config[config/]
            Constants[constants/]
            Env[environment/]
        end
    end
    
    subgraph "Component Packages"
        subgraph "UI Components"
            UILib[ui/]
            Forms[forms/]
            Layout[layout/]
            Navigation[navigation/]
        end
        
        subgraph "Feature Components"
            Auth[auth/]
            Dashboard[dashboard/]
            Transactions[transactions/]
            Analytics[analytics/]
            AI[ai/]
        end
        
        subgraph "Common Components"
            Shared[shared/]
            Icons[icons/]
            Loaders[loaders/]
            Modals[modals/]
        end
    end
    
    subgraph "External Dependencies"
        ReactPkg[React]
        TypeScript[TypeScript]
        Supabase[Supabase]
        TailwindCSS[Tailwind CSS]
        TanStackQuery[TanStack Query]
        Recharts[Recharts]
        LucideReact[Lucide React]
    end
    
    Pages --> Components
    Components --> UILib
    Components --> Forms
    Components --> Layout
    
    Auth --> Components
    Dashboard --> Components
    Transactions --> Components
    Analytics --> Components
    AI --> Components
    
    Contexts --> Services
    Services --> Utils
    Services --> Types
    
    Integrations --> API
    API --> Storage
    
    Components --> Hooks
    Hooks --> Contexts
    
    Config --> Constants
    Constants --> Env
    
    Components --> ReactPkg
    Types --> TypeScript
    API --> Supabase
    Styles --> TailwindCSS
    Hooks --> TanStackQuery
    Analytics --> Recharts
    Components --> LucideReact
```

These UML diagrams provide a comprehensive view of the system architecture, component relationships, user interactions, and data flow patterns within the expense tracker application.
