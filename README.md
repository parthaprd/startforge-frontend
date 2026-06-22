# StartupForge - Frontend

A modern, full-featured platform connecting **startup founders** with **collaborators**. Built with Next.js, React, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![React](https://img.shields.io/badge/React-19.1-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-purple)

---

## 🚀 Features

### Public Pages
- **Landing Page** — Hero section, stats, featured startups/opportunities, how it works, success stories, CTA
- **Browse Startups** — Search, industry filter, paginated grid
- **Startup Detail** — Full startup profile with opportunities list
- **Browse Opportunities** — Advanced filters (work type, commitment, industry), search, pagination
- **Opportunity Detail** — Full detail with apply modal, deadline countdown

### Authentication
- **Login** — Email/password, Google OAuth, remember me
- **Register** — Image upload, password strength indicator, role selection (Founder/Collaborator)

### Founder Dashboard
- **Overview** — Stats cards, revenue chart, recent applications
- **My Startup** — Create, view, edit, delete startup with status banners
- **Opportunities** — CRUD management with free tier limit (3)
- **Applications** — Review, accept, or reject incoming applications
- **Upgrade** — Premium plan with Stripe checkout integration

### Collaborator Dashboard
- **Overview** — Stats, recent application activity
- **Browse Opportunities** — Search and filter with apply functionality
- **My Applications** — Track status, withdraw, view details

### Admin Dashboard
- **Overview** — Platform-wide analytics with charts (Recharts)
- **Manage Users** — Search, block/unblock users
- **Manage Startups** — Approve, reject, delete startups with status filters
- **Transactions** — Payment history, revenue summary

### Profile
- **View Profile** — Avatar, bio, skills, portfolio, startup info, premium benefits
- **Edit Profile** — Image upload, name, bio, skills, portfolio with validation

### Payment
- **Success Page** — Animated confirmation, transaction details, benefits overview
- **Cancel Page** — Retry payment, common reasons for failure

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.3.3 (App Router) |
| UI Library | React 19.1 |
| Styling | Tailwind CSS 3.4.17 |
| Animations | Framer Motion 12 |
| Forms | React Hook Form 7 + Yup |
| HTTP Client | Axios (with interceptors) |
| Charts | Recharts |
| Notifications | react-hot-toast |
| Icons | Lucide React |
| Date Utils | date-fns 4 |
| Payments | Stripe (@stripe/stripe-js) |
| Image Upload | ImgBB (via backend) |

---

## 📁 Folder Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Auth route group (login, register)
│   ├── (public)/               # Public route group (startups, opportunities)
│   ├── dashboard/              # Protected dashboard pages
│   │   ├── founder/            # Founder-specific pages
│   │   ├── collaborator/       # Collaborator-specific pages
│   │   ├── admin/              # Admin-specific pages
│   │   ├── profile/            # Profile view & edit
│   │   └── layout.jsx          # Dashboard layout with sidebar
│   ├── payment/                # Payment success/cancel pages
│   ├── layout.jsx              # Root layout
│   ├── page.jsx                # Home page
│   ├── loading.jsx             # Global loading
│   ├── error.jsx               # Error boundary
│   └── not-found.jsx           # 404 page
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Avatar.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Checkbox.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   ├── RadioGroup.jsx
│   │   ├── Select.jsx
│   │   ├── SkillsInput.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Spinner.jsx
│   │   ├── Table.jsx
│   │   ├── Tabs.jsx
│   │   └── Textarea.jsx
│   ├── layout/                 # Layout components
│   │   ├── DashboardLayout.jsx
│   │   ├── Footer.jsx
│   │   ├── Logo.jsx
│   │   ├── MobileMenu.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── auth/                   # ProtectedRoute
│   ├── dashboard/              # StatsCard, PageHeader, AnalyticsChart
│   ├── home/                   # All home page sections
│   ├── startups/               # StartupCard, StartupForm
│   ├── opportunities/           # OpportunityCard, Form, Filters, ApplyModal
│   └── payment/                # PricingCard
├── context/
│   ├── AuthContext.jsx         # Auth state management
│   └── ToastContext.jsx        # Toast notification provider
├── hooks/
│   ├── useAuth.js              # Auth context hook
│   ├── useDebounce.js          # Debounced value hook
│   ├── useToast.js             # Toast notification helpers
│   └── useUser.js              # User role/premium helpers
├── lib/
│   ├── api.js                  # Axios instance with interceptors
│   ├── auth.js                 # Token helpers (localStorage)
│   └── utils.js                # Utility functions
├── services/                   # API service layer
│   ├── adminService.js
│   ├── applicationService.js
│   ├── authService.js
│   ├── opportunityService.js
│   ├── paymentService.js
│   ├── startupService.js
│   └── uploadService.js
├── constants/
│   ├── index.js                # App constants, industries, etc.
│   └── routes.js               # Route paths
├── validations/                 # Yup schemas
│   ├── authSchema.js
│   ├── opportunitySchema.js
│   └── startupSchema.js
└── styles/
    └── globals.css             # Tailwind directives + custom styles
```

---

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ (tested with Node 18-22)
- npm or yarn
- Backend API running at `http://localhost:5000`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd startup-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_URL` | App base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key | — |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key for image uploads | — |

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🏗 Architecture

### Service Layer Pattern
All API calls go through the `services/` layer. Components never call `api` directly — they use service functions. This keeps API logic centralized and easily testable.

```
Component → Service → Axios Instance → Backend API
```

### Authentication Flow
1. User logs in → JWT token stored in `localStorage`
2. Axios request interceptor attaches `Authorization: Bearer <token>` header
3. Axios response interceptor unwraps `response.data` and handles 401 → redirect to login
4. `AuthContext` provides user state, login/logout/updateUser/refreshUser

### Route Protection
- `ProtectedRoute` component wraps dashboard pages
- Checks authentication and allowed roles
- Redirects unauthenticated users to `/login`
- Redirects unauthorized roles to their own dashboard

### State Management
- **Auth state**: React Context (`AuthContext`)
- **Form state**: React Hook Form
- **Component state**: `useState` / `useEffect`
- **URL state**: `useSearchParams` for filters/pagination

---

## 🎨 Design System

- **Primary**: Blue gradient (`#3B82F6` → `#6366F1`)
- **Secondary**: Purple (`#8B5CF6`)
- **Success**: Green (`#10B981`)
- **Warning**: Amber (`#F59E0B`)
- **Danger**: Red (`#EF4444`)
- **Font**: Inter (Google Fonts)
- **Animations**: Framer Motion with stagger effects
- **Custom shadows**: `card` and `card-hover` elevation

---

## 📄 License

This project is proprietary. All rights reserved.
