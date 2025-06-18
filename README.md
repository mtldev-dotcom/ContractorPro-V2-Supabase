# 🏗️ Contractor Management System

A comprehensive, enterprise-grade contractor management application built with Next.js 15, TypeScript, and PostgreSQL. This system provides complete business management capabilities for general contractors, from project planning to financial reporting.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Database Schema](#database-schema)
- [User Roles & Permissions](#user-roles--permissions)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Contractor Management System is a full-stack web application designed to streamline operations for general contractors. It provides comprehensive tools for project management, financial tracking, employee management, equipment monitoring, and client relations.

### Key Capabilities

- **Project Management**: Complete project lifecycle management from planning to completion
- **Financial Management**: Income/expense tracking, invoicing, and payroll processing
- **Employee Management**: Staff scheduling, time tracking, and performance monitoring
- **Equipment & Inventory**: Asset tracking, maintenance scheduling, and material management
- **Client Relations**: Contact management, communication tracking, and document sharing
- **Document Management**: Centralized file storage with role-based access control
- **Time Tracking**: Real-time employee time tracking with GPS location support
- **Reporting**: Comprehensive business intelligence and analytics

## ✨ Features

### 🏢 **Core Business Management**
- Multi-company support with tenant isolation
- Role-based access control (Admin, Manager, Employee, Client)
- Comprehensive user management and authentication
- Company profile and settings management

### 📊 **Project Management**
- Project creation and lifecycle management
- Task assignment and progress tracking
- Gantt charts and timeline visualization
- Change order management
- Project budgeting and cost tracking
- Site location mapping with GPS coordinates

### 💰 **Financial Management**
- Income and expense tracking
- Professional invoice generation
- Payment tracking and overdue management
- Tax calculation and reporting
- Profit/loss analysis
- Budget vs. actual reporting

### 👥 **Employee Management**
- Employee profiles and contact information
- Skill and certification tracking
- Payroll processing with tax calculations
- Performance reviews and ratings
- Emergency contact management

### ⏰ **Time Tracking**
- Real-time clock in/out functionality
- GPS location verification
- Overtime calculation
- Break time management
- Project-specific time allocation
- Mobile-friendly time entry

### 🔧 **Equipment & Inventory**
- Equipment tracking and maintenance scheduling
- Material inventory management
- Stock level monitoring with alerts
- Supplier management and purchasing
- Equipment assignment to projects
- Depreciation tracking

### 📁 **Document Management**
- Centralized file storage and organization
- Project and client document association
- Version control and access permissions
- Document categories and tagging
- Search and filtering capabilities

### 📱 **Mobile-First Design**
- Responsive design for all screen sizes
- Touch-friendly interface
- Offline capability (planned)
- Progressive Web App (PWA) features

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form handling and validation
- **Recharts** - Data visualization library

### **Backend**
- **Next.js API Routes** - Server-side API endpoints
- **PostgreSQL** - Primary database
- **Prisma** (optional) - Database ORM
- **NextAuth.js** - Authentication system
- **bcryptjs** - Password hashing

### **Infrastructure**
- **Vercel** - Deployment platform
- **Supabase** - Database hosting (optional)
- **AWS S3** - File storage (optional)
- **Redis** - Caching (optional)

## 📋 Prerequisites

Before installing the application, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (v13.0 or higher)
- **Git** for version control

### System Requirements

- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

## 🚀 Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/contractor-management-system.git
cd contractor-management-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Using npm
npm install

# Using yarn
yarn install
\`\`\`

### 3. Install Global Dependencies (if needed)

\`\`\`bash
# Install PostgreSQL client tools (if not already installed)
# On macOS
brew install postgresql

# On Ubuntu/Debian
sudo apt-get install postgresql-client

# On Windows
# Download and install from https://www.postgresql.org/download/windows/
\`\`\`

## 🗄️ Database Setup

### 1. Install PostgreSQL

#### **macOS (using Homebrew)**
\`\`\`bash
brew install postgresql
brew services start postgresql
\`\`\`

#### **Ubuntu/Debian**
\`\`\`bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
\`\`\`

#### **Windows**
Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

\`\`\`bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database
CREATE DATABASE contractor_management;

# Create user with password
CREATE USER contractor_user WITH ENCRYPTED PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE contractor_management TO contractor_user;

# Grant schema privileges
\c contractor_management
GRANT ALL ON SCHEMA public TO contractor_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO contractor_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO contractor_user;

# Exit PostgreSQL
\q
\`\`\`

### 3. Run Database Migrations

\`\`\`bash
# Navigate to the project directory
cd contractor-management-system

# Run the schema migration
psql -h localhost -U contractor_user -d contractor_management -f scripts/migration-to-new-schema.sql

# Seed the database with sample data
psql -h localhost -U contractor_user -d contractor_management -f scripts/seed-enhanced-data.sql

# Seed invoice data
psql -h localhost -U contractor_user -d contractor_management -f scripts/seed-invoices-data.sql
\`\`\`

### 4. Verify Database Setup

\`\`\`bash
# Connect to verify tables were created
psql -h localhost -U contractor_user -d contractor_management

# List all tables
\dt

# Check a few key tables
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM clients;

# Exit
\q
\`\`\`

## ⚙️ Environment Configuration

### 1. Create Environment File

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 2. Configure Environment Variables

Edit `.env.local` with your specific configuration:

\`\`\`env
# Database Configuration
DATABASE_URL="postgresql://contractor_user:your_secure_password@localhost:5432/contractor_management"
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=contractor_management
POSTGRES_USER=contractor_user
POSTGRES_PASSWORD=your_secure_password

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars

# Application Configuration
NODE_ENV=development
APP_NAME="Contractor Management System"
APP_VERSION=1.0.0

# File Upload Configuration (Optional)
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx,xls,xlsx

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# External Services (Optional)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
\`\`\`

### 3. Generate NextAuth Secret

\`\`\`bash
# Generate a secure secret
openssl rand -base64 32
\`\`\`

## 🏃‍♂️ Running the Application

### 1. Development Mode

\`\`\`bash
# Start the development server
npm run dev

# Or with yarn
yarn dev
\`\`\`

The application will be available at `http://localhost:3000`

### 2. Production Build

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

### 3. Database Commands

\`\`\`bash
# Reset database (caution: this will delete all data)
npm run db:reset

# Run migrations only
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Backup database
npm run db:backup

# Restore database from backup
npm run db:restore backup-file.sql
\`\`\`

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

### **Core Tables**
- `users` - System users and authentication
- `companies` - Multi-tenant company data
- `employees` - Employee information and HR data

### **Project Management**
- `projects` - Project details and status
- `tasks` - Task management and assignment
- `change_orders` - Project change requests

### **Financial Management**
- `transactions` - Income and expense tracking
- `invoices` - Invoice generation and tracking
- `invoice_line_items` - Detailed invoice items
- `payroll` - Employee payroll processing

### **Client & Supplier Management**
- `clients` - Customer information
- `suppliers` - Vendor and supplier data
- `communications` - Communication history

### **Equipment & Inventory**
- `equipment` - Equipment tracking and maintenance
- `materials` - Material inventory management
- `material_usage` - Project material consumption

### **Time & Document Management**
- `time_tracking` - Employee time tracking
- `documents` - Document storage and management

### **Schema Diagram**

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USERS     │    │ COMPANIES   │    │ EMPLOYEES   │
│             │    │             │    │             │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ email       │    │ name        │    │ user_id (FK)│
│ role        │    │ legal_name  │    │ company_id  │
│ ...         │    │ ...         │    │ ...         │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  PROJECTS   │    │   CLIENTS   │    │   TASKS     │
│             │    │             │    │             │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ client_id   │    │ company_id  │    │ project_id  │
│ company_id  │    │ type        │    │ assigned_to │
│ ...         │    │ ...         │    │ ...         │
└─────────────┘    └─────────────┘    └─────────────┘
\`\`\`

## 👤 User Roles & Permissions

### **Admin**
- Full system access
- Company management
- User management
- System configuration
- All financial data access

### **Manager**
- Project management
- Employee management
- Financial reporting
- Client management
- Equipment management

### **Employee**
- Time tracking
- Task management
- Document access (assigned projects)
- Personal profile management

### **Client**
- Project status viewing
- Document access (own projects)
- Communication history
- Invoice viewing

## 🔗 API Documentation

### **Authentication Endpoints**

\`\`\`typescript
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/session
\`\`\`

### **Project Management**

\`\`\`typescript
GET    /api/projects          // List all projects
POST   /api/projects          // Create new project
GET    /api/projects/[id]     // Get project details
PUT    /api/projects/[id]     // Update project
DELETE /api/projects/[id]     // Delete project
\`\`\`

### **Financial Management**

\`\`\`typescript
GET    /api/invoices          // List invoices
POST   /api/invoices          // Create invoice
GET    /api/invoices/[id]     // Get invoice details
PUT    /api/invoices/[id]     // Update invoice
POST   /api/invoices/[id]/send // Send invoice to client
\`\`\`

### **Time Tracking**

\`\`\`typescript
POST   /api/time/clock-in     // Clock in employee
POST   /api/time/clock-out    // Clock out employee
GET    /api/time/current      // Get current time entries
GET    /api/time/history      // Get time history
\`\`\`

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

1. **Connect to Vercel**
\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

2. **Configure Environment Variables**
- Add all environment variables in Vercel dashboard
- Ensure `DATABASE_URL` points to production database

3. **Deploy**
\`\`\`bash
vercel --prod
\`\`\`

### **Docker Deployment**

1. **Create Dockerfile**
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

2. **Build and Run**
\`\`\`bash
docker build -t contractor-management .
docker run -p 3000:3000 contractor-management
\`\`\`

### **Traditional Server Deployment**

1. **Build Application**
\`\`\`bash
npm run build
\`\`\`

2. **Configure Process Manager**
\`\`\`bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "contractor-app" -- start

# Configure auto-restart
pm2 startup
pm2 save
\`\`\`

## 🔧 Configuration Options

### **Application Settings**

\`\`\`typescript
// config/app.ts
export const appConfig = {
  name: 'Contractor Management System',
  version: '1.0.0',
  timezone: 'America/New_York',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h', // or '24h'
  pagination: {
    defaultPageSize: 25,
    maxPageSize: 100
  },
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  }
}
\`\`\`

### **Database Configuration**

\`\`\`typescript
// config/database.ts
export const dbConfig = {
  pool: {
    min: 2,
    max: 10,
    idle: 30000,
    acquire: 60000
  },
  logging: process.env.NODE_ENV === 'development',
  timezone: '+00:00'
}
\`\`\`

## 🧪 Testing

### **Run Tests**

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

### **Test Database Setup**

\`\`\`bash
# Create test database
createdb contractor_management_test

# Run test migrations
NODE_ENV=test npm run db:migrate
\`\`\`

## 📝 Development Guidelines

### **Code Style**

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### **Git Workflow**

\`\`\`bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
\`\`\`

### **Database Migrations**

\`\`\`bash
# Create new migration
npm run migration:create migration-name

# Run migrations
npm run migration:run

# Rollback migration
npm run migration:rollback
\`\`\`

## 🐛 Troubleshooting

### **Common Issues**

1. **Database Connection Error**
\`\`\`bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U contractor_user -d contractor_management
\`\`\`

2. **Port Already in Use**
\`\`\`bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
\`\`\`

3. **Environment Variables Not Loading**
\`\`\`bash
# Ensure .env.local exists and has correct format
cat .env.local

# Restart development server
npm run dev
\`\`\`

### **Performance Optimization**

1. **Database Indexing**
- Monitor slow queries
- Add indexes for frequently queried columns
- Use EXPLAIN ANALYZE for query optimization

2. **Caching**
- Implement Redis for session storage
- Cache frequently accessed data
- Use Next.js built-in caching

## 📞 Support

### **Getting Help**

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@contractormanagement.com

### **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **shadcn/ui** - For the beautiful UI components
- **PostgreSQL** - For the robust database system
- **Open Source Community** - For the countless libraries and tools

---

## 📈 Roadmap

### **Version 1.1 (Q2 2024)**
- [ ] Mobile app (React Native)
- [ ] Advanced reporting dashboard
- [ ] Email/SMS notifications
- [ ] API rate limiting
- [ ] Advanced search functionality

### **Version 1.2 (Q3 2024)**
- [ ] GPS tracking for vehicles
- [ ] Offline mode support
- [ ] Integration with QuickBooks
- [ ] Advanced project templates
- [ ] Customer portal

### **Version 2.0 (Q4 2024)**
- [ ] Multi-language support
- [ ] Advanced analytics and AI insights
- [ ] Integration marketplace
- [ ] White-label solutions
- [ ] Enterprise SSO

---

**Built with ❤️ by the Contractor Management Team**

For more information, visit our [website](https://contractormanagement.com) or contact us at [hello@contractormanagement.com](mailto:hello@contractormanagement.com).
