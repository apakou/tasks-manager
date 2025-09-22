# 🔖 Tasks Manager

> A modern, intuitive task management application designed for individuals and teams who want to stay organized and boost productivity in their daily workflows.

## 🎯 What We're Building

**Tasks Manager** is a comprehensive task organization platform that transforms how you manage your daily responsibilities. Built for busy professionals, students, and anyone who values structured productivity, this application provides:

- **Seamless Task Organization** - Create, categorize, and prioritize tasks with intuitive workflows
- **Daily Focus** - Special emphasis on daily task management to maintain momentum
- **Smart Prioritization** - Four-tier priority system (Low, Medium, High, Urgent) with visual indicators
- **Flexible Organization** - Custom categories, tags, and due date management
- **Secure & Personal** - User authentication ensures your tasks remain private and accessible only to you

### Why It Matters
In today's fast-paced world, effective task management is crucial for success. Our application bridges the gap between simple to-do lists and complex project management tools, offering just the right balance of features and simplicity.

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router for modern web development
- **TypeScript** - Type-safe development with enhanced developer experience
- **Tailwind CSS v4** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible React components
- **React Hook Form** - Performant forms with easy validation
- **Lucide React** - Beautiful, customizable icons

### Backend & API
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Supabase Auth** - User authentication and authorization
- **Zod** - TypeScript-first schema validation library
- **PostgreSQL** - Robust, scalable relational database (via Supabase)

### Development & Deployment
- **Node.js 18+** - JavaScript runtime environment
- **ESLint & Prettier** - Code linting and formatting
- **Vercel** - Deployment platform (recommended)
- **Git** - Version control system

## 🚀 Key Features

- **🔐 User Authentication** - Secure login/signup with JWT tokens and HTTP-only cookies
- **📅 Daily Task Management** - Organize and track tasks by date with calendar integration
- **🏷️ Smart Organization** - Categories, tags, and custom grouping options
- **⚡ Priority System** - Four-tier priority levels with visual indicators and sorting
- **📱 Responsive Design** - Mobile-first approach, works seamlessly on all devices
- **🎨 Modern UI** - Clean, intuitive interface built with shadcn/ui components
- **⚙️ Type Safety** - Full TypeScript implementation for robust development
- **🔄 Real-time Updates** - Instant task updates and state synchronization
- **🔍 Advanced Filtering** - Search and filter tasks by multiple criteria
- **📊 Progress Tracking** - Visual progress indicators and completion statistics

## 📁 Project Structure

```
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (protected)/           # Protected pages requiring authentication
│   │   ├── dashboard/
│   │   └── tasks/
│   ├── api/                   # API routes
│   │   ├── auth/
│   │   └── tasks/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/                  # Authentication components
│   ├── forms/                 # Form components
│   ├── layout/                # Layout components
│   ├── tasks/                 # Task-related components
│   └── ui/                    # shadcn/ui components
├── hooks/                     # Custom React hooks
├── lib/
│   ├── auth/                  # Authentication utilities
│   ├── db/                    # Database schema and utilities
│   ├── validations/           # Zod validation schemas
│   └── utils.ts              # Utility functions
├── types/                     # TypeScript type definitions
└── middleware.ts             # Next.js middleware for route protection
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tasks-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Set up authentication providers if needed

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. (Optional) Set up the database schema:
   - In your Supabase dashboard, go to the SQL Editor
   - Run the commands in `lib/db/schema.sql` to create the tables
   - Or use the built-in auth system without custom tables initially

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Authentication Setup

The app uses Supabase Auth with email/password authentication. Users need to verify their email before they can sign in.

**Email Verification:**
- After signup, users receive a verification email
- The verification link redirects to `/auth/callback`
- Users are then redirected to the dashboard upon successful verification

## 🛣️ Roadmap

### Phase 1 - Foundation ✅
- [x] Project scaffolding
- [x] Basic UI components
- [x] Authentication structure
- [x] Task CRUD operations
- [x] Database schema

### Phase 2 - Core Features
- [ ] Database integration
- [ ] Real authentication with password hashing
- [ ] Task search and filtering
- [ ] Calendar view

### Phase 3 - Advanced Features
- [ ] Task reminders/notifications
- [ ] Team collaboration
- [ ] Mobile app support

## 💡 Tips for Development

1. **Authentication**: Replace mock authentication with NextAuth.js or Auth0 for production
2. **Database**: Implement proper database integration using Prisma or Drizzle
3. **Testing**: Add unit tests with Jest and integration tests with Playwright
4. **Deployment**: Ready for deployment on Vercel, Netlify, or any Node.js platform

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
