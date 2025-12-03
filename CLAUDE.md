# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ModuCalculator (모두의 계산기) is a React-based financial calculator web application that provides multiple calculation tools including exchange rates, salary/wages, savings interest, and loan payments. The app features a modern glassmorphism UI design with gradient backgrounds and is built with TypeScript and Tailwind CSS.

## Development Commands

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server (runs on http://localhost:5173 by default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with custom glassmorphism design
- **Icons**: lucide-react
- **Package Manager**: Yarn (note: project uses Yarn PnP based on .pnp.cjs)

## Project Structure

```
src/
├── App.tsx       # Main application component with all calculator logic
├── main.tsx      # React entry point
└── index.css     # Global styles and Tailwind directives
```

## Architecture

### Single-Component Design

The entire application logic is contained within `src/App.tsx` (~770 lines). This is a deliberate architectural choice for this project - **do not break it into separate files unless explicitly requested**.

### Component Organization in App.tsx

1. **Utility Functions** (lines 24-35):
   - `formatNumber()`: Formats numbers with Korean locale comma separators
   - `parseNumber()`: Parses formatted strings back to numbers

2. **Design System Components** (lines 40-115):
   - `GlassCard`: Glassmorphism-styled container
   - `SectionTitle`: Section headers with icons
   - `DreamInput`: Custom input with number formatting
   - `ResultRow`: Result display row component
   - `TabButton`: Navigation tab button

3. **Calculator Components** (lines 120-663):
   - `ExchangeRateCalc`: Currency exchange calculator with live API integration
   - `SalaryCalc`: Dual-mode wage calculator (hourly/salaried) with tax and insurance calculations
   - `InterestCalc`: Savings interest calculator (simple/compound)
   - `LoanCalc`: Loan payment calculator with equal installment method

4. **Main App Component** (lines 690-770):
   - Tab-based navigation between calculators
   - Gradient background with animated blobs
   - Responsive layout

### Key Features & Implementation Details

#### Exchange Rate Calculator
- Fetches live rates from `https://open.er-api.com/v6/latest/KRW`
- Supports USD, JPY (100 yen), EUR, CNY
- Fallback to offline rates on API failure
- Special handling for JPY (displayed per 100 yen)

#### Salary Calculator
- **Hourly Mode**: Includes weekly holiday pay calculation (주휴수당) for workers with 15+ hours/week
- **Salary Mode**: Calculates 4대보험 (Korean 4 major insurances):
  - National Pension (4.5%)
  - Health Insurance (3.545%)
  - Long-term Care (12.95% of health insurance)
  - Employment Insurance (0.9%)
- Simplified income tax calculation with dependent deductions
- Non-taxable income support (meal allowance, car allowance, childcare)

#### Interest & Loan Calculators
- Simple and compound interest calculations
- 15.4% tax on interest (Korean ISA tax rate)
- Equal installment loan repayment (원리금균등상환)

### State Management

All state is managed locally with React `useState` hooks. No external state management library is used.

### Styling Patterns

- Tailwind utility classes throughout
- Custom glassmorphism: `bg-white/10 backdrop-blur-md border border-white/20`
- Gradient text: `bg-clip-text bg-gradient-to-r from-white to-pink-200`
- Responsive breakpoints: mobile-first with `md:` and `lg:` prefixes
- Custom animations: fade-in, pulse effects on background gradients

### File Download Feature

The `downloadFile()` helper function (lines 666-674) creates text file downloads of calculation results.

## Configuration Files

- `vite.config.ts`: Minimal Vite config with no plugins
- `tsconfig.json`: TypeScript config with `strict: false`, JSX set to `react-jsx`
- `tailwind.config.js`: Tailwind configuration
- `postcss.config.js`: PostCSS configuration for Tailwind

## Important Notes

- TypeScript strict mode is disabled (`strict: false`)
- The codebase intentionally uses a single-file component structure
- Korean language is used for UI text and comments
- Number formatting uses Korean locale (KRW with comma separators)
- The app is fully client-side with no backend except external exchange rate API
