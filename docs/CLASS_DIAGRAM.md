
# Class Diagrams

## 1. Frontend Component Architecture

```mermaid
classDiagram
    class App {
        +QueryClient queryClient
        +render() ReactElement
    }
    
    class Index {
        -boolean isAuthenticated
        -boolean showAddModal
        +handleAuth() void
        +handleLogout() void
        +render() ReactElement
    }
    
    class TransactionsProvider {
        -Transaction[] transactions
        -setTransactions() void
        +addTransaction(Omit~Transaction, 'id'~) void
        +render() ReactElement
    }
    
    class Dashboard {
        +onLogout() void
        +render() ReactElement
    }
    
    class TransactionsList {
        +transactions Transaction[]
        +getTransactionIcon(type) ReactElement
        +getAmountColor(type) string
        +formatDate(string) string
        +render() ReactElement
    }
    
    class AddTransactionModal {
        +open boolean
        +onOpenChange(boolean) void
        -formData TransactionFormData
        +handleSubmit() void
        +render() ReactElement
    }
    
    class FinancialCharts {
        +transactions Transaction[]
        -chartData ChartData
        +render() ReactElement
    }
    
    class AISummarySection {
        +transactions Transaction[]
        +dateRange DateRange
        -summary string
        -insights Insight[]
        +generateSummary() void
        +render() ReactElement
    }
    
    class FinanceChatBot {
        +transactions Transaction[]
        -messages Message[]
        -inputMessage string
        +generateBotResponse(string) string
        +handleSendMessage() void
        +render() ReactElement
    }
    
    class DateRangeSelector {
        +onDateRangeChange(DateRange) void
        -dateType string
        -selectedMonth string
        +handleMonthChange(string) void
        +render() ReactElement
    }
    
    App --> Index
    Index --> TransactionsProvider
    TransactionsProvider --> Dashboard
    Dashboard --> TransactionsList
    Dashboard --> FinancialCharts
    Dashboard --> AISummarySection
    Dashboard --> FinanceChatBot
    Dashboard --> DateRangeSelector
    Index --> AddTransactionModal
```

## 2. Data Models and Types

```mermaid
classDiagram
    class Transaction {
        +string id
        +TransactionType type
        +number amount
        +string description
        +string category
        +string subcategory
        +string account
        +string date
        +string note?
    }
    
    class Category {
        +string name
        +string[] subcategories
    }
    
    class TransactionFormData {
        +TransactionType type
        +string amount
        +string description
        +string category
        +string subcategory
        +string account
        +string date
        +string note
    }
    
    class ChartData {
        +MonthlyData[] monthly
        +CategoryData[] categories
    }
    
    class MonthlyData {
        +string month
        +number income
        +number expenses
        +number investments
    }
    
    class CategoryData {
        +string name
        +number value
    }
    
    class Message {
        +string id
        +string content
        +boolean isBot
        +Date timestamp
    }
    
    class Insight {
        +InsightType type
        +string text
    }
    
    class DateRange {
        +Date start
        +Date end
        +DateRangeType type
    }
    
    class User {
        +string id
        +string email
        +string fullName?
        +string avatarUrl?
    }
    
    Transaction --> Category : uses
    TransactionFormData --> Transaction : creates
    ChartData --> MonthlyData : contains
    ChartData --> CategoryData : contains
    FinanceChatBot --> Message : manages
    AISummarySection --> Insight : generates
    DateRangeSelector --> DateRange : emits
```

## 3. Context and State Management

```mermaid
classDiagram
    class TransactionsContext {
        <<interface>>
        +Transaction[] transactions
        +addTransaction(Omit~Transaction, 'id'~) void
    }
    
    class TransactionsContextProvider {
        -Transaction[] transactions
        -setTransactions(Transaction[]) void
        +addTransaction(transactionData) void
        +value TransactionsContext
        +children ReactNode
    }
    
    class useTransactions {
        <<hook>>
        +() TransactionsContext
        +validateContext() void
    }
    
    TransactionsContextProvider ..|> TransactionsContext : implements
    useTransactions --> TransactionsContext : consumes
```

## 4. Authentication System

```mermaid
classDiagram
    class AuthPage {
        +onAuth() void
        -isLoading boolean
        -formData AuthFormData
        +handleSubmit(AuthType) Promise~void~
        +handleInputChange(string, string) void
        +render() ReactElement
    }
    
    class AuthFormData {
        +string email
        +string password
        +string name
    }
    
    class SupabaseAuth {
        +signIn(credentials) Promise~AuthResponse~
        +signUp(credentials) Promise~AuthResponse~
        +signOut() Promise~void~
        +getUser() User | null
        +onAuthStateChange(callback) void
    }
    
    AuthPage --> AuthFormData : uses
    AuthPage --> SupabaseAuth : integrates
```

## 5. UI Component System

```mermaid
classDiagram
    class Button {
        +variant ButtonVariant
        +size ButtonSize
        +disabled boolean
        +onClick() void
        +children ReactNode
        +render() ReactElement
    }
    
    class Card {
        +className string
        +children ReactNode
        +render() ReactElement
    }
    
    class CardHeader {
        +className string
        +children ReactNode
        +render() ReactElement
    }
    
    class CardContent {
        +className string
        +children ReactNode
        +render() ReactElement
    }
    
    class Input {
        +type InputType
        +value string
        +onChange(Event) void
        +placeholder string
        +disabled boolean
        +render() ReactElement
    }
    
    class Select {
        +value string
        +onValueChange(string) void
        +children ReactNode
        +render() ReactElement
    }
    
    class Modal {
        +open boolean
        +onOpenChange(boolean) void
        +children ReactNode
        +render() ReactElement
    }
    
    Card --> CardHeader : contains
    Card --> CardContent : contains
```

## 6. Data Layer Integration

```mermaid
classDiagram
    class SupabaseClient {
        +auth SupabaseAuth
        +database SupabaseDatabase
        +from(table) SupabaseQueryBuilder
        +rpc(fn, params) Promise~any~
    }
    
    class SupabaseDatabase {
        +select(columns) SupabaseQueryBuilder
        +insert(data) SupabaseQueryBuilder
        +update(data) SupabaseQueryBuilder
        +delete() SupabaseQueryBuilder
    }
    
    class SupabaseQueryBuilder {
        +eq(column, value) SupabaseQueryBuilder
        +filter(column, operator, value) SupabaseQueryBuilder
        +order(column, options) SupabaseQueryBuilder
        +limit(count) SupabaseQueryBuilder
        +execute() Promise~any~
    }
    
    class DatabaseService {
        -client SupabaseClient
        +getTransactions(userId) Promise~Transaction[]~
        +createTransaction(data) Promise~Transaction~
        +updateTransaction(id, data) Promise~Transaction~
        +deleteTransaction(id) Promise~void~
    }
    
    SupabaseClient --> SupabaseDatabase : contains
    SupabaseClient --> SupabaseAuth : contains
    SupabaseDatabase --> SupabaseQueryBuilder : returns
    DatabaseService --> SupabaseClient : uses
```

## 7. Utility Classes and Helpers

```mermaid
classDiagram
    class DateUtils {
        +static formatDate(Date) string
        +static parseDate(string) Date
        +static isValidDate(string) boolean
        +static getMonthRange(string) DateRange
    }
    
    class CurrencyUtils {
        +static formatCurrency(number) string
        +static parseCurrency(string) number
        +static validateAmount(string) boolean
    }
    
    class ValidationUtils {
        +static validateEmail(string) boolean
        +static validateRequired(string) boolean
        +static validateTransactionForm(data) ValidationResult
    }
    
    class ChartUtils {
        +static processTransactionData(Transaction[]) ChartData
        +static generateColors(number) string[]
        +static formatChartValue(number) string
    }
    
    class AIUtils {
        +static analyzeSpending(Transaction[]) SpendingAnalysis
        +static generateInsights(data) Insight[]
        +static processUserQuery(string, Transaction[]) string
    }
```

## 8. Error Handling System

```mermaid
classDiagram
    class ErrorBoundary {
        +hasError boolean
        +error Error | null
        +static getDerivedStateFromError(Error) State
        +componentDidCatch(Error, ErrorInfo) void
        +render() ReactElement
    }
    
    class CustomError {
        +message string
        +code string
        +statusCode number
        +timestamp Date
        +constructor(message, code, statusCode)
    }
    
    class ValidationError {
        +field string
        +value any
        +rule string
        +constructor(field, value, rule)
    }
    
    class NetworkError {
        +url string
        +method string
        +status number
        +constructor(url, method, status)
    }
    
    class ErrorHandler {
        +static handleError(Error) void
        +static logError(Error) void
        +static showUserError(Error) void
    }
    
    CustomError <|-- ValidationError
    CustomError <|-- NetworkError
    ErrorBoundary --> ErrorHandler : uses
```

## 9. Performance Optimization Classes

```mermaid
classDiagram
    class CacheManager {
        -cache Map~string, any~
        +get(key) any
        +set(key, value, ttl) void
        +clear() void
        +has(key) boolean
    }
    
    class LazyLoader {
        +static loadComponent(path) Promise~Component~
        +static preloadRoute(route) void
        +static loadImage(src) Promise~HTMLImageElement~
    }
    
    class PerformanceMonitor {
        +static startTiming(name) void
        +static endTiming(name) number
        +static recordMetric(name, value) void
        +static getMetrics() PerformanceMetrics
    }
    
    class Memoization {
        +static memoize(fn) Function
        +static createMemoizedComponent(Component) Component
        +static useMemoizedValue(fn, deps) any
    }
```

## 10. Testing Infrastructure

```mermaid
classDiagram
    class TestUtils {
        +static renderWithProviders(Component, options) RenderResult
        +static createMockTransaction() Transaction
        +static mockSupabaseClient() SupabaseClient
        +static waitForElement(selector) Promise~Element~
    }
    
    class MockData {
        +static transactions Transaction[]
        +static categories Category[]
        +static users User[]
        +static generateTransaction(overrides) Transaction
    }
    
    class TestHooks {
        +static useTestTransactions() Transaction[]
        +static useTestAuth() AuthState
        +static useTestRouter() RouterState
    }
    
    class ComponentTester {
        +component ReactComponent
        +props ComponentProps
        +render() RenderResult
        +fireEvent(event) void
        +findByText(text) Promise~Element~
        +findByRole(role) Promise~Element~
    }
    
    TestUtils --> MockData : uses
    ComponentTester --> TestUtils : extends
```

## Class Relationships Summary

### Key Patterns:
1. **Component Hierarchy**: Clear parent-child relationships with prop drilling and context consumption
2. **Separation of Concerns**: Data models separate from UI components
3. **Context Pattern**: Centralized state management with provider/consumer pattern
4. **Service Layer**: Database operations abstracted into service classes
5. **Utility Classes**: Static methods for common operations
6. **Error Boundaries**: Comprehensive error handling at multiple levels

### Design Principles:
1. **Single Responsibility**: Each class has a focused purpose
2. **Open/Closed**: Components open for extension, closed for modification
3. **Interface Segregation**: Small, focused interfaces
4. **Dependency Inversion**: Depend on abstractions, not concretions
5. **Composition over Inheritance**: Favor component composition
6. **Immutability**: State updates through new objects, not mutations

This class structure provides a solid foundation for maintainable, testable, and scalable code.
