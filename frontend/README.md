# B2B CRM Frontend

A modern, role-based B2B CRM dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository (if applicable)
# git clone <repository-url>
# cd frontend

# Install dependencies
npm install
# or
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
src/
├── shared/           # Shared components, utilities, and services
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API clients and services
│   ├── stores/       # Zustand state stores
│   ├── utils/        # Utility functions and constants
│   └── config/       # Configuration files
├── auth/             # Authentication module
│   ├── components/   # Auth-specific components
│   ├── contexts/     # Auth context providers
│   ├── pages/        # Auth pages (login, register)
│   └── services/     # Auth API services
├── admin/            # Admin dashboard module
│   ├── components/   # Admin-specific components
│   ├── pages/        # Admin pages
│   └── services/     # Admin API services
├── seller/           # Seller dashboard module
│   ├── components/   # Seller-specific components
│   ├── pages/        # Seller pages
│   └── services/     # Seller API services
└── assets/           # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Blue palette for main actions and branding
- **Secondary**: Gray palette for secondary elements
- **Success**: Green for positive states
- **Warning**: Orange for caution states
- **Danger**: Red for error states

### Components
- Glass-morphism cards with subtle blur effects
- Consistent border radius (10px, 16px, 20px)
- Soft shadows and smooth transitions
- Focus rings for accessibility

## 🔐 Authentication

The app supports role-based authentication:
- **Admin**: Full platform management access
- **Seller**: Business management and product listing
- **Support**: Customer service features (planned)

### Protected Routes
Routes are protected based on user roles:
- `/admin/*` - Admin only
- `/seller/*` - Seller only
- `/auth/*` - Public authentication pages

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_VERSION=v1
VITE_JWT_SECRET_KEY=your-jwt-secret
VITE_ENABLE_DARK_MODE=true
```

## 🏗 Architecture

### State Management
- **Zustand** for global state management
- **React Context** for authentication
- **React Hook Form** for form state

### API Layer
- **Axios** with interceptors for API calls
- Automatic token refresh
- Request/response logging
- Error normalization

### Styling
- **Tailwind CSS** with custom design tokens
- **CSS-in-JS** with class variance authority
- Light/dark theme support
- Mobile-first responsive design

## 🎯 Features

### Shared Components
- Modern UI component library
- Loading states and skeletons
- Error boundaries
- File upload with progress
- Data tables with sorting/filtering

### Admin Features
- User management and verification
- Product approval workflows
- Analytics dashboard
- Platform settings
- Business verification queue

### Seller Features
- Product management
- Lead tracking and conversion
- Business profile management
- Performance analytics
- Customer communication

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Collapsible navigation
- **Tablet**: Optimized layouts
- **Desktop**: Full sidebar navigation

## 🌙 Dark Mode

Automatic dark/light theme switching based on system preference with manual override.

## 🔧 Configuration

### Tailwind Config
Custom design tokens and utility classes in `tailwind.config.js`

### Vite Config
Path aliases and build optimization in `vite.config.ts`

### TypeScript
Strict type checking with path mapping in `tsconfig.json`

## 🚢 Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the built application
# Deploy to your hosting provider of choice
```

## 📄 License

This project is licensed under the MIT License.