# Retro — Personal Finance Management Dashboard

> A recruiter-ready React 18 + TypeScript portfolio project inspired by the provided UI reference.

## 1. Project Story for Recruiters

Build a **personal finance dashboard** that helps users track income, expenses, invoices, savings goals, and spending trends. This single project demonstrates a full modern frontend engineering skill set: typed React architecture, state management, API integration, data visualization, testing, accessibility, performance, and CI/CD.

The UI is inspired by a clean card-based dashboard (see reference screenshot) with:

- A left sidebar for navigation.
- KPI cards at the top (Expected Income, Salary, Monthly Income).
- "Quick Overview" cards with mini-charts (Social Media, Freelancing, Salary).
- A credit-card-style balance widget.
- Recent contacts and a 30-day activity area chart.

The project is deliberately scoped so it can be built, explained, and demoed in a reasonable time while still showing production-quality code.

## 2. Tech Stack

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | React 18 + TypeScript | Typed components, hooks, modern patterns |
| Build tool | Vite | Fast dev, simple config, modern output |
| State | Redux Toolkit + Thunks | Normalized state, async thunks, selectors |
| Routing | React Router v6 | Protected routes, lazy-loaded route code splitting |
| Styling | Tailwind CSS | Utility-first, responsive, design tokens |
| Forms | React Hook Form + Zod | Type-safe validation, performant forms |
| API | Axios + centralized client | Interceptors, retries, cancellation, typed contracts |
| Charts | Recharts | React-friendly, interactive, accessible tooltips |
| Testing | Vitest + React Testing Library + Playwright | Unit, integration, and E2E coverage |
| Backend | Node.js + Express (mock REST API) | Full-stack demo without external dependencies |
| CI/CD | GitHub Actions | Lint, typecheck, test, build, deploy |

## 3. Minimum Viable Feature Set (Build This First)

The goal is a **working dashboard that matches the screenshot** and can be explained in 10 minutes. Advanced features can be added later.

### Phase 1: Dashboard Overview

- Layout with sidebar + main content.
- KPI cards with mock data and percentage change badges.
- "Quick Overview" cards with mini trend charts.
- Balance card (credit-card style).
- 30-day activity area chart.
- Loading skeletons and empty states.

### Phase 2: Transactions

- Transaction list table with search, filter, sort, pagination.
- Add/edit/delete transaction modals.
- Form validation with Zod.
- CSV export of filtered results.

### Phase 3: Savings Plans

- Savings goals list with progress bars.
- Create/edit savings goal.
- Contribute to a goal and update progress.

### Phase 4: Authentication

- Login page with mock authentication.
- Protected routes.
- Session expiration handling.
- Role-based UI (admin vs user) in mock backend.

### Phase 5: API + Backend

- Express REST API serving mock data.
- Centralized Axios client with interceptors.
- TypeScript request/response contracts.

### Phase 6: Testing + CI/CD

- Unit tests for reducers, selectors, utilities, forms.
- Component tests for KPI cards, tables, modals.
- Playwright E2E tests for login and transaction CRUD.
- GitHub Actions workflow for lint, test, build.

## 4. Folder Structure

```text
src/
├── app/
│   ├── store.ts                 # Redux store configuration
│   ├── router.tsx               # React Router with lazy routes
│   └── providers.tsx            # App providers (Redux, Router)
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── dashboardSlice.ts
│   │   ├── dashboardThunks.ts
│   │   ├── dashboardSelectors.ts
│   │   └── DashboardPage.tsx
│   ├── transactions/
│   ├── savings/
│   ├── analytics/
│   └── auth/
├── components/
│   ├── ui/                      # Buttons, inputs, cards, modals
│   ├── charts/                  # Reusable chart wrappers
│   └── data-table/              # Searchable, sortable, paginated table
├── services/
│   ├── api-client.ts            # Axios client with interceptors
│   └── endpoints/               # Feature-specific API functions
├── hooks/                       # Shared custom hooks
├── layouts/                     # App shell, sidebar
├── types/                       # Shared TypeScript types
├── utils/                       # Helpers (currency, dates, CSV export)
└── tests/                       # Setup and E2E specs
```

## 5. Component Inventory (Mapped to Screenshot)

| UI Element | Component | Notes |
|------------|-------------|-------|
| Sidebar | `Sidebar` | Navigation links, active state, responsive collapse |
| Top bar | `TopBar` | Search, notifications, user avatar, greeting |
| KPI card | `KpiCard` | Title, value, change %, sparkline optional |
| Quick overview card | `OverviewCard` | Title, amount, mini chart |
| Balance card | `BalanceCard` | Credit-card style, number, holder, expiry |
| Activity chart | `AreaChart` | 30-day / 12-month activity |
| Contacts list | `RecentContacts` | Avatar, name, timestamp |
| Data table | `DataTable` | Sortable, paginated, filterable |
| Modal | `Modal` | Accessible dialog with focus trap |
| Form inputs | `TextField`, `Select`, `DatePicker` | With labels and error messages |
| Progress | `ProgressBar` | Savings goal completion |
| Skeleton | `Skeleton` | Loading placeholder |
| Empty state | `EmptyState` | No data / error / retry |

## 6. Data Model

```typescript
interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'income' | 'expense';
  amount: number;
  account: string;
  status: 'completed' | 'pending';
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface DashboardSummary {
  totalIncome: number;
  paidInvoices: number;
  unpaidInvoices: number;
  monthlySavings: number;
  incomeChange: number;
  expenseChange: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}
```

## 7. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/dashboard/summary` | KPI data |
| GET | `/api/dashboard/activity` | Chart data |
| GET | `/api/transactions` | List with query params |
| POST | `/api/transactions` | Create transaction |
| PATCH | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/savings` | Savings goals |
| POST | `/api/savings` | Create goal |
| POST | `/api/savings/:id/contribute` | Add contribution |
| POST | `/api/auth/login` | Mock login |
| POST | `/api/auth/logout` | Mock logout |

## 8. Recruiter Talking Points

Use these to explain what you built and why.

1. **Type-safe architecture**: TypeScript interfaces for API contracts and Redux state. Strict mode enabled.
2. **Feature-based structure**: Code is organized by domain, not by file type, making it easy to scale.
3. **Redux Toolkit**: Normalized state for transactions, selectors for derived data, async thunks for API calls.
4. **Performance**: Lazy-loaded routes, memoized selectors, `React.memo` on heavy components where profiling shows benefit.
5. **Accessibility**: Keyboard navigation, ARIA labels, focus management in modals, color-contrast compliant.
6. **Testing**: Unit tests for reducers and utilities; component tests with React Testing Library; E2E with Playwright.
7. **CI/CD**: GitHub Actions runs lint, typecheck, tests, and build on every PR.
8. **API integration**: Centralized Axios client with request/response interceptors, error handling, and cancellation tokens.
9. **Data visualization**: Recharts with responsive containers, accessible tooltips, and filtering by time range.
10. **Form handling**: React Hook Form + Zod for performant, validated, type-safe forms.

## 9. Suggested Implementation Order

1. Scaffold Vite + React + TypeScript + Tailwind.
2. Set up folder structure and base layout.
3. Build static dashboard UI matching the reference.
4. Add Redux Toolkit and wire dashboard data.
5. Build transactions CRUD with table, filters, and forms.
6. Build savings goals with progress tracking.
7. Add mock Express API and Axios client.
8. Add authentication and protected routes.
9. Write tests and configure CI/CD.
10. Profile and optimize performance.

## 10. Verification Checklist

Before calling the project done, verify:

- [ ] Dashboard renders correctly on desktop, tablet, and mobile.
- [ ] Loading and error states work for all async operations.
- [ ] Forms show validation errors and prevent invalid submissions.
- [ ] All routes are protected except login.
- [ ] Unit and integration tests pass.
- [ ] At least one E2E test covers login → transaction CRUD.
- [ ] CI pipeline passes on GitHub.
- [ ] README includes setup steps, screenshots, and performance notes.

## 11. Notes

- Use realistic mock data so the dashboard looks alive during demos.
- Keep secrets and environment-specific config out of source code.
- Document any trade-offs (e.g., why Recharts over Chart.js, why Redux over Context).
