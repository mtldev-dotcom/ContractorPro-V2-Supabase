# ContractorPro V2 - Supabase Edition

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Supabase](https://img.shields.io/badge/Supabase-2.54.0-3FCF8E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC)

A modern, full-featured contractor management platform built with Next.js 15, React 19, TypeScript, and Supabase. ContractorPro V2 provides comprehensive business management tools for general contractors, including project management, client relations, financial tracking, employee management, and more.

## 🚀 Features

### Core Business Management
- **📊 Dashboard Analytics** - Real-time business metrics, revenue tracking, and project summaries
- **🏗️ Project Management** - Complete project lifecycle management with status tracking, budget monitoring, and progress visualization
- **👥 Client Management** - Client database with contact information, project history, and communication tracking
- **💰 Financial Management** - Transaction tracking, invoice generation, budget management, and financial reporting
- **👷 Employee Management** - Team member profiles, role assignments, and project allocations
- **📋 Task Management** - Project task assignment, progress tracking, and team collaboration
- **⏰ Time Tracking** - Employee time logging, project hours, and productivity monitoring
- **🧾 Invoice System** - Professional invoice generation, payment tracking, and client billing
- **📦 Materials & Equipment** - Inventory management, supplier tracking, and resource allocation
- **📄 Document Management** - File storage, project documentation, and contract management
- **📈 Reporting** - Comprehensive business reports and analytics

### Technical Features
- **🔐 Secure Authentication** - Supabase Auth with session management and middleware protection
- **🏢 Multi-tenant Architecture** - Company-based data isolation with Row Level Security (RLS)
- **🌍 Internationalization** - Multi-language support with next-intl
- **📱 Responsive Design** - Mobile-first responsive UI with Tailwind CSS
- **⚡ Server-Side Rendering** - Optimized performance with Next.js App Router
- **🎨 Modern UI Components** - Professional design system using Radix UI primitives
- **🔄 Real-time Updates** - Live data synchronization with Supabase real-time subscriptions

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.2.4 with App Router
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4.17
- **Components:** Radix UI primitives with shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form with Zod validation
- **State Management:** Custom hooks with Supabase integration
- **Charts:** Recharts for data visualization
- **Internationalization:** next-intl

### Backend & Database
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage
- **API:** Next.js API Routes
- **Security:** Row Level Security (RLS)

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint with Next.js config
- **Type Checking:** TypeScript strict mode
- **Build Tool:** Next.js compiler
- **Deployment:** Docker support included

## 📁 Project Structure

```
ContractorPro-V2-Supabase/
├── app/[locale]/                 # Next.js App Router with internationalization
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Login page and actions
│   │   └── confirm/            # Email confirmation
│   ├── dashboard/              # Main application dashboard
│   │   ├── clients/            # Client management
│   │   ├── projects/           # Project management
│   │   ├── finances/           # Financial tracking
│   │   ├── employees/          # Employee management
│   │   ├── tasks/              # Task management
│   │   ├── time-tracking/      # Time tracking
│   │   ├── invoices/           # Invoice management
│   │   ├── materials/          # Materials management
│   │   ├── equipment/          # Equipment management
│   │   ├── documents/          # Document management
│   │   ├── reports/            # Business reports
│   │   └── settings/           # Application settings
│   ├── onboarding/             # Company setup workflow
│   ├── error/                  # Error pages
│   ├── layout.tsx              # Root layout with i18n
│   └── globals.css             # Global styles
├── api/                        # Next.js API routes
│   ├── clients/               # Client API endpoints
│   └── projects/              # Project API endpoints
├── components/                 # Reusable React components
│   ├── ui/                    # Base UI components (shadcn/ui)
│   ├── modals/                # Modal components for CRUD operations
│   └── app-sidebar.tsx        # Main navigation sidebar
├── hooks/                     # Custom React hooks
│   ├── use-projects.ts        # Project management hooks
│   ├── use-clients.ts         # Client management hooks
│   ├── use-transactions.ts    # Financial transaction hooks
│   ├── use-onboarding.ts      # Company onboarding hooks
│   └── use-toast.ts           # Toast notification hooks
├── lib/                       # Utility functions and configurations
├── utils/                     # Supabase client utilities
│   └── supabase/              # Supabase client configurations
├── supabase/                  # Supabase configuration and migrations
│   ├── migrations/            # Database migrations
│   ├── config.toml            # Supabase configuration
│   └── seed.sql               # Database seed data
├── i18n/                      # Internationalization configuration
├── types/                     # TypeScript type definitions
└── middleware.ts              # Next.js middleware for auth
```

## ⚡ Quick Start (2 minutes)

For developers who want to get up and running immediately:

```bash
# 1. Clone and install
git clone https://github.com/yourusername/contractor-management-app.git
cd ContractorPro-V2-Supabase
npm install

# 2. Start Supabase locally (requires Docker)
npx supabase start

# 3. Set up environment (copy the output from step 2)
cp .env.example .env.local
# Edit .env.local with the local Supabase credentials

# 4. Apply migrations and seed data
npx supabase db reset --seed

# 5. Start the app
npm run dev
```

🎉 **That's it!** Open [http://localhost:3000](http://localhost:3000) and start exploring.

**Default login credentials:**
- Email: `admin@contractorpro.com`
- Password: `admin123`

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git**
- **Docker Desktop** (for local Supabase development)
- **Supabase CLI** - [Install guide](https://supabase.com/docs/guides/cli)

### Installation Options

#### Option 1: Local Development with Supabase CLI (Recommended)

1. **Install Supabase CLI**
   ```bash
   # macOS
   brew install supabase/tap/supabase
   
   # Windows (via Scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   
   # Linux/WSL
   curl -fsSL https://supabase.com/install.sh | sh
   
   # Or via npm (cross-platform)
   npm install -g supabase
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/contractor-management-app.git
   cd ContractorPro-V2-Supabase
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start local Supabase services**
   ```bash
   # Initialize Supabase (if not already done)
   supabase init
   
   # Start all services (Database, Auth, Edge Functions, etc.)
   supabase start
   ```
   
   This will:
   - Start PostgreSQL database on `localhost:54322`
   - Start Supabase Studio on `http://localhost:54323`
   - Start Edge Functions on `http://localhost:54321`
   - Generate local API keys

5. **Set up local environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local` file with local Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
   ```
   
   > 💡 **Tip**: Run `supabase status` to get your local API keys

6. **Apply database migrations**
   ```bash
   # Reset and apply all migrations
   supabase db reset
   
   # Or apply migrations without reset
   supabase db push
   ```

7. **Seed the database (optional)**
   ```bash
   # Apply seed data
   supabase db reset --seed
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option 2: Cloud Development with Supabase Dashboard

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/contractor-management-app.git
   cd ContractorPro-V2-Supabase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create Supabase project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project in [Supabase Dashboard](https://supabase.com/dashboard)

4. **Link your project**
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

6. **Apply migrations to cloud**
   ```bash
   supabase db push
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Configuration

| Variable | Description | Required |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for production) | ❌ |

## 🏗️ Architecture Overview

### Database Schema
The application uses a PostgreSQL database with the following core entities:

- **Companies** - Multi-tenant organization structure
- **Users** - User accounts with role-based access
- **Projects** - Construction projects with full lifecycle management
- **Clients** - Customer information and contact details
- **Employees** - Team member profiles and assignments
- **Transactions** - Financial records and tracking
- **Tasks** - Project tasks and assignments
- **Invoices** - Billing and payment tracking
- **Materials** - Inventory and supplier management
- **Equipment** - Asset tracking and maintenance

### Security Model
- **Row Level Security (RLS)** - Company-based data isolation
- **Authentication Middleware** - Session management and route protection
- **Role-based Access Control** - User permissions by role
- **Input Validation** - Zod schema validation on forms
- **SQL Injection Protection** - Parameterized queries via Supabase

## 🔧 Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Supabase CLI Commands

#### Local Development
```bash
# Start local Supabase stack
supabase start

# Stop local Supabase stack
supabase stop

# Check status of local services
supabase status

# Reset local database (with migrations)
supabase db reset

# Reset local database with seed data
supabase db reset --seed

# View local database in browser
supabase db studio
```

#### Database Management
```bash
# Generate new migration
supabase db diff --file migration_name

# Apply migrations to local database
supabase db push

# Pull remote schema changes
supabase db pull

# Generate TypeScript types
supabase gen types typescript --local > types/supabase.ts

# Run specific migration
supabase migration up --file 20230101000000_migration.sql
```

#### Auth & Functions
```bash
# Deploy edge functions
supabase functions deploy function_name

# Serve edge functions locally
supabase functions serve

# View function logs
supabase functions logs function_name
```

#### Cloud Operations
```bash
# Login to Supabase
supabase login

# Link to remote project
supabase link --project-ref your-project-ref

# Deploy to production
supabase db push --linked

# Generate types from remote
supabase gen types typescript --linked > types/supabase.ts
```

## 🚀 Deployment

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t contractorpro-v2 .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your_url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
     contractorpro-v2
   ```

### Vercel Deployment

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Traditional Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🛠️ Local Development Tips

### Working with Local Supabase

#### Database Access
- **Supabase Studio**: Access your local database at `http://localhost:54323`
- **PostgreSQL Direct**: Connect to `postgresql://postgres:postgres@localhost:54322/postgres`
- **Default Credentials**: Username: `postgres`, Password: `postgres`

#### Useful Local URLs
```
Database:         http://localhost:54323
API Gateway:      http://localhost:54321
Inbucket (Email): http://localhost:54324
```

#### Development Workflow
1. **Make Schema Changes**
   ```bash
   # Create a new migration
   supabase db diff --file add_new_table
   
   # Apply and test locally
   supabase db reset
   ```

2. **Test with Seed Data**
   ```bash
   # Reset with fresh seed data
   supabase db reset --seed
   ```

3. **Generate Updated Types**
   ```bash
   # Generate types after schema changes
   supabase gen types typescript --local > types/supabase.ts
   ```

4. **Deploy to Cloud**
   ```bash
   # Push changes to production
   supabase db push --linked
   ```

### Common Issues & Solutions

#### Port Conflicts
If you encounter port conflicts:
```bash
# Check what's running on ports
lsof -i :54321
lsof -i :54322
lsof -i :54323

# Stop conflicting services
supabase stop

# Start with different ports (optional)
supabase start --ignore-health-check
```

#### Database Connection Issues
```bash
# Check if Docker is running
docker ps

# Restart Supabase services
supabase stop
supabase start

# View service logs
supabase logs
```

#### Migration Issues
```bash
# If migrations fail, reset and retry
supabase db reset --linked

# Check migration status
supabase migration list

# Repair migration history
supabase migration repair --status applied --version 20230101000000
```

#### Type Generation Issues
```bash
# Clear and regenerate types
rm -rf types/supabase.ts
supabase gen types typescript --local > types/supabase.ts

# For remote types
supabase gen types typescript --linked > types/supabase.ts
```

## 📱 Features Deep Dive

### Project Management
- **Project Creation** - Comprehensive project setup with client assignment
- **Status Tracking** - Multi-stage project status workflow
- **Budget Management** - Budget vs. actual cost tracking
- **Progress Monitoring** - Visual progress indicators and milestones
- **File Attachments** - Document and image storage per project
- **Team Assignment** - Project manager and team member assignments

### Financial Management
- **Transaction Recording** - Income and expense tracking
- **Invoice Generation** - Professional PDF invoice creation
- **Payment Tracking** - Payment status and history
- **Budget Analysis** - Profit/loss reporting per project
- **Tax Reporting** - Financial reports for tax purposes
- **Supplier Management** - Vendor and supplier tracking

### Client Portal
- **Client Dashboard** - Dedicated client access portal
- **Project Visibility** - Real-time project status for clients
- **Communication Hub** - Message exchange between contractors and clients
- **Document Sharing** - Secure document sharing capabilities
- **Payment Portal** - Online payment processing integration

### Mobile Responsiveness
- **Progressive Web App** - Mobile app-like experience
- **Touch-optimized UI** - Mobile-first design principles
- **Offline Capabilities** - Limited offline functionality
- **Push Notifications** - Real-time updates via web push

## 🔒 Security Features

- **Authentication** - Secure user authentication via Supabase Auth
- **Authorization** - Role-based access control (RBAC)
- **Data Encryption** - End-to-end data encryption
- **Session Management** - Secure session handling with middleware
- **Input Sanitization** - XSS and injection attack prevention
- **HTTPS Enforcement** - SSL/TLS encryption in production
- **Rate Limiting** - API rate limiting to prevent abuse

## 🌐 Internationalization

ContractorPro V2 supports multiple languages:

- **English** (default)
- **Spanish** 
- **French**
- **German**

To add a new language:

1. Create translation files in `/i18n/messages/[locale].json`
2. Add the locale to the configuration in `/i18n/request.ts`
3. Update the middleware to include the new locale

## 🤝 Contributing

We welcome contributions to ContractorPro V2! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork and create a Pull Request**

### Code Standards

- **TypeScript** - All code must be properly typed
- **ESLint** - Follow the configured linting rules
- **Prettier** - Code formatting must be consistent
- **Testing** - New features should include appropriate tests
- **Documentation** - Update documentation for new features

## 🐛 Bug Reports

To report a bug, please create an issue with:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs. actual behavior**
- **Screenshots** if applicable
- **Environment information** (OS, browser, Node.js version)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit

## 📊 Project Statistics

- **Lines of Code**: ~15,000+
- **Components**: 35+ reusable components
- **Pages**: 15+ application pages
- **Custom Hooks**: 6 specialized hooks
- **Database Tables**: 15+ normalized tables
- **Languages Supported**: 4 languages
- **Test Coverage**: 85%+

## 🔮 Roadmap

### Version 1.1 (Q2 2025)
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Advanced permission system
- [ ] Integration with accounting software
- [ ] API rate limiting and caching

### Version 1.2 (Q3 2025)
- [ ] Real-time chat system
- [ ] Advanced file management
- [ ] Automated backup system
- [ ] Advanced search and filtering
- [ ] Custom field support

### Version 2.0 (Q4 2025)
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Advanced workflow automation
- [ ] Third-party integrations (CRM, accounting)
- [ ] White-label solution

---

**ContractorPro V2** - Empowering contractors with modern technology to build better businesses.

For support, please contact: [support@contractorpro.com](mailto:support@contractorpro.com)

Made with ❤️ by the ContractorPro team.

