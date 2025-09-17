# Tasks Manager

A modern, full-stack task management application built with Next.js 15, featuring user authentication, daily task organization, and a clean, intuitive interface.

## 🚀 Features

- **User Authentication** - Secure login/signup with JWT tokens
- **Daily Task Management** - Organize tasks by date and priority
- **Task Categories & Tags** - Organize tasks with categories and custom tags
- **Priority Levels** - Low, Medium, High, and Urgent priority settings
- **Responsive Design** - Mobile-first design using Tailwind CSS
- **Modern UI Components** - Built with shadcn/ui components
- **TypeScript** - Full type safety throughout the application
- **API Routes** - RESTful API endpoints for all operations

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: JWT tokens with HTTP-only cookies
- **Database**: PostgreSQL (schema provided)
- **Icons**: Lucide React

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
- PostgreSQL database (optional for development)

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

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. (Optional) Set up the database:
   ```sql
   -- Run the SQL commands in lib/db/schema.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login

For development/testing, you can use:
- **Email**: demo@example.com
- **Password**: demo123

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
