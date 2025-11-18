# Digi Metalomecanica - Frontend Application

A modern backoffice management system built with Next.js for managing candidates and employees in the metalworking industry. This application provides comprehensive tools for HR management, candidate tracking, employee data management, and geographic location-based searches.

## 🚀 Overview

**Digi Metalomecanica** is a full-featured backoffice web application designed to streamline HR operations and workforce management for Filipe Metalomecanica. The system includes:

- **Candidate Management**: Add, edit, view, and search candidates with detailed profiles
- **Employee Management**: Manage employee data including technical and administrative roles
- **Geolocation Features**: Interactive map-based location search and radius filtering
- **User Authentication**: Secure login system with NextAuth.js
- **Dashboard Analytics**: Real-time metrics and data visualization
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS and Mantine UI

## 🏗️ Tech Stack

- **Framework**: [Next.js 15.4.6](https://nextjs.org) with App Router and React 19
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 4.0 + Mantine UI 7.17.4
- **Authentication**: NextAuth.js 4.24.11
- **State Management**: Jotai 2.12.2
- **Forms**: React Hook Form 7.55.0
- **HTTP Client**: Axios 1.8.2
- **Maps**: Leaflet 1.9.4 + React Leaflet 5.0.0
- **Charts**: Recharts 3.0.0
- **Build Tool**: Next.js Turbopack
- **Deployment**: Docker + Nginx with CI/CD via CircleCI

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))

Optional for deployment:

- **Docker**: Version 20.x or higher ([Download](https://www.docker.com/))
- **Docker Compose**: For container orchestration

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/luisfsantos22/digi-metalomec-fe.git
cd digi-metalomec-fe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory by copying the example file:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```bash
# Application Settings
NEXT_PUBLIC_DESKTOP_WIDTH=1024
NEXT_PUBLIC_API_URL=http://your-backend-api-url

# NextAuth.js Configuration
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl

# Node Environment
NODE_ENV=development
```

#### Generate NEXTAUTH_SECRET

Use one of these methods to generate a secure secret:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser to see the application.

The page auto-updates as you edit files in the `app/` directory.

## 📦 Available Scripts

| Script          | Description                                           |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Starts development server with Turbopack on port 3000 |
| `npm run build` | Creates optimized production build                    |
| `npm start`     | Runs the production server                            |
| `npm run lint`  | Runs ESLint to check code quality                     |

## 🏛️ Project Structure

```
digi-metalomec-fe/
├── app/                          # Next.js App Router directory
│   ├── actions/                  # Server actions
│   ├── api/                      # API routes
│   │   └── auth/                 # NextAuth.js authentication
│   ├── auth/                     # Authentication pages
│   │   └── signin/              # Sign-in page
│   ├── candidate/               # Candidate management pages
│   │   ├── add/                 # Add new candidate
│   │   ├── details/[id]/        # Candidate details (dynamic route)
│   │   └── edit/                # Edit candidate
│   ├── employee/                # Employee management pages
│   │   ├── add/                 # Add new employee
│   │   ├── details/[id]/        # Employee details
│   │   └── edit/                # Edit employee
│   ├── dashboard/               # Main dashboard
│   ├── components/              # Reusable React components
│   │   ├── Badge/              # Badge components
│   │   ├── Button/             # Button components
│   │   ├── Card/               # Card components
│   │   ├── Dropdown/           # Dropdown components
│   │   ├── Form/               # Form components
│   │   ├── Input/              # Input components
│   │   ├── Modal/              # Modal dialogs
│   │   ├── Navbar/             # Navigation components
│   │   ├── Table/              # Table components
│   │   └── pages/              # Page-specific components
│   ├── hooks/                   # Custom React hooks
│   │   ├── api/                # API hooks
│   │   ├── candidates/         # Candidate-related hooks
│   │   ├── employees/          # Employee-related hooks
│   │   └── axiosInstance.ts    # Configured Axios instance
│   ├── mappers/                 # Data transformation utilities
│   ├── types/                   # TypeScript type definitions
│   ├── css/                     # Global styles
│   ├── atoms.tsx               # Jotai state atoms
│   ├── constants.tsx           # Application constants
│   ├── layout.tsx              # Root layout
│   └── utils.tsx               # Utility functions
├── public/                      # Static assets
│   ├── icons/                  # Icon files
│   ├── images/                 # Image files
│   └── gifs/                   # GIF files
├── Dockerfile/                  # Docker configurations
│   ├── prod/                   # Production Dockerfile
│   └── staging/                # Staging Dockerfile
├── nginx/                       # Nginx configurations
├── utils/                       # Shared utilities
├── .circleci/                  # CircleCI CI/CD configuration
├── middleware.ts               # Next.js middleware (auth guards)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── eslint.config.mjs           # ESLint configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🔑 Key Features

### Authentication & Authorization

- Secure login system with NextAuth.js
- Session-based authentication with cookies
- Protected routes with middleware guards
- Automatic redirect for unauthenticated users

### Candidate Management

- Create, read, update, and delete candidate profiles
- Advanced search and filtering capabilities
- Geographic location tracking with interactive maps
- Radius-based location search
- Document upload and management

### Employee Management

- Comprehensive employee data management
- Technical and administrative employee types
- Employee details with full profile information
- Role-based data organization

### Dashboard

- Real-time metrics and KPIs
- Data visualization with charts
- Quick access to key features
- Responsive card-based layout

### Geographic Features

- Interactive Leaflet maps
- Location picker with geocoding
- Radius-based search (e.g., "find candidates within 50km")
- Visual map markers for locations

## 🔧 Configuration

### TypeScript Configuration

The project uses TypeScript with strict type checking. Key configurations:

- **Target**: ES2017
- **Module**: Node16 with ESM support
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` maps to project root

### Next.js Configuration

- **Output**: Standalone (optimized for Docker deployment)
- **React Strict Mode**: Disabled for compatibility
- **ESLint**: Ignored during builds (run separately)

### Styling

- **Tailwind CSS 4.0**: Utility-first CSS framework
- **Mantine UI**: Component library for React
- **Custom CSS Modules**: For component-specific styles

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Production build
docker build -f Dockerfile/prod/Dockerfile -t digi-metalomec-fe:prod .

# Staging build
docker build -f Dockerfile/staging/Dockerfile -t digi-metalomec-fe:staging .
```

### Run with Docker Compose

```bash
# Production
docker-compose up -d

# Staging
docker-compose -f docker-compose-staging.yml up -d
```

## 🚀 Deployment

The application uses a CI/CD pipeline with CircleCI for automated deployments:

- **Staging**: Deployed on push to `develop` branch
  - URL: Direct access via server IP on port 8089
- **Production**: Deployed on push to `main` branch
  - URL: https://backoffice.filipemetalomecanica.pt
  - SSL-secured with Nginx reverse proxy

For detailed deployment documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🧪 Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write self-documenting code with clear naming

### Component Structure

```typescript
// Example component structure
import { FC } from 'react'

interface ComponentProps {
  // Props definition
}

export const Component: FC<ComponentProps> = ({ prop }) => {
  // Component implementation
  return <div>{/* JSX */}</div>
}
```

### API Integration

Use the configured Axios instance with interceptors:

```typescript
import { axiosInstance } from '@/app/hooks/axiosInstance'

const fetchData = async () => {
  const response = await axiosInstance.get('/endpoint')
  return response.data
}
```

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Test thoroughly
4. Submit a pull request to `develop`
5. After review and approval, changes will be merged

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch for staging
- `feat/*`: Feature branches
- `fix/*`: Bug fix branches

## 📝 Environment Variables Reference

| Variable                    | Description                   | Required | Example                   |
| --------------------------- | ----------------------------- | -------- | ------------------------- |
| `NEXT_PUBLIC_API_URL`       | Backend API base URL          | Yes      | `https://api.example.com` |
| `NEXTAUTH_URL`              | Application URL for NextAuth  | Yes      | `http://127.0.0.1:3000`   |
| `NEXTAUTH_SECRET`           | Secret key for NextAuth       | Yes      | Generated with OpenSSL    |
| `NEXT_PUBLIC_DESKTOP_WIDTH` | Breakpoint for desktop layout | No       | `1024`                    |
| `NODE_ENV`                  | Node environment              | Yes      | `development`             |

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Kill the process using port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

**Module not found errors:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Leaflet CSS not loading:**

- Ensure Leaflet CSS is imported in the component or globally
- Check for dynamic imports if using SSR

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Mantine UI Documentation](https://mantine.dev)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [React Leaflet Documentation](https://react-leaflet.js.org)

## 📄 License

This project is proprietary software for Filipe Metalomecanica.

## 👥 Support

For support and questions, please contact the development team.

---

**Built with ❤️ using Next.js and TypeScript**
