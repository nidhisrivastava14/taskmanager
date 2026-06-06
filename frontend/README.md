# Taskly Frontend - React Client Application

This directory houses the client application for Taskly. It is constructed using React 18, Vite, React Router v6, Tailwind CSS, and Axios.

## Core Features
1. **Atomic Components**: Reusable UI parts separating layouts, controls, and grids.
2. **Context-Driven State**: Shared state for Authentication (`AuthContext`), Dark/Light Mode Theme (`ThemeContext`), and Toast systems (`ToastContext`).
3. **Advanced Filter Toolbar**: Quick filtering by completion status, priority metrics, and customized due-date ranges.
4. **Form validations**: Real-time validation checks for login/register pages and task creation fields.

---

## Component Hierarchy

The components are organized using an atomic design structure:

```
App.jsx (Root Routing & Guarding Wrapper)
 └── ErrorBoundary (Intercepts rendering crashes)
      └── ThemeProvider (Switches html class properties)
           └── ToastProvider (Maintains list of notification banners)
                └── AuthProvider (Controls authentication tokens and headers)
                     ├── Login Page (/login)
                     ├── Register Page (/register)
                     └── Dashboard Page (/dashboard - Protected)
                          └── DashboardLayout (Binds general page templates)
                               ├── Navbar (Logo, profiling, theme/logout buttons)
                               ├── StatCard Grid (Header statistical panels)
                               └── TaskList (Container grid)
                                    ├── Search / Filters Toolbar
                                    └── TaskCard (Renders individual objectives)
                                         ├── Checkbox Toggle Buttons
                                         └── Action buttons (Edit/Delete)
                                              └── TaskForm (Modal sheet overlay)
```

---

## Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── atoms/          # Basic building blocks (Styles, standard DOM elements)
│   │   │   ├── Button.jsx  # Styled button with disabled loading state
│   │   │   ├── Input.jsx   # Text field with label and error boundaries
│   │   │   ├── Card.jsx    # Card container layout
│   │   │   └── Spinner.jsx # Custom SVG spinner
│   │   ├── molecules/      # Standard layout groups (Cards, modular views)
│   │   │   ├── StatCard.jsx# Individual statistics panel
│   │   │   ├── TaskCard.jsx# Task layout with badges and control buttons
│   │   │   ├── TaskForm.jsx# Modal sheet for adding and editing
│   │   │   └── Toast.jsx   # Floating toast item and absolute overlay list
│   │   ├── organisms/      # Page regions (Toolbars, nav headers, sidebars)
│   │   │   ├── Navbar.jsx  # Glassmorphism header with user profile actions
│   │   │   ├── TaskList.jsx# Filter toolbar wrapper + tasks grid
│   │   │   └── DashboardLayout.jsx # Page framing layout
│   │   └── ErrorBoundary.jsx # Global error handler component
│   ├── context/            # Custom contexts
│   │   ├── AuthContext.jsx # Local token caching, logins, and logouts
│   │   ├── ThemeContext.jsx# Persisted light/dark mode switchers
│   │   └── ToastContext.jsx# Live toasts state queue
│   ├── pages/              # Application views
│   │   ├── Login.jsx       # Log in form with check listeners
│   │   ├── Register.jsx    # Signup form with entropy meter
│   │   └── Dashboard.jsx   # Coordinator for metrics & tasks
│   ├── services/           # Network utilities
│   │   └── api.js          # Centralized Axios client & interceptors
│   ├── App.jsx             # Main routing registry
│   ├── index.css           # Global style setups & custom scrollbars
│   └── main.jsx            # React root mount script
├── tailwind.config.js      # Dark-mode setup and palette definitions
├── postcss.config.js       # Preprocessing hooks
└── index.html              # Main HTML mounting container
```

---

## Styling and Design Specs
- **Backgrounds**: Deep Blue-Slate background (`#0F172A`) for dark mode, Soft Slate (`#F8FAFC`) for light mode.
- **Card Panels**: Charcoal-Slate (`#1E293B`) for dark mode cards, pure white for light mode cards.
- **Accent Color**: Violet/Indigo (`#6366F1`) used on primary CTA buttons.
- **Typography**: Inter (system-ui sans-serif) configured across all items.
- **Transitions**: 200ms ease transition applied for color changes when switching themes.
