<div align="center">

# Shahglobal EXOTICS

**Luxury Vehicle Inventory & Dealership Platform**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

A full-featured, production-ready exotic automotive dealership platform with dynamic inventory, VIP test drive bookings, sell-your-car valuations, financing calculator, and a comprehensive admin dashboard.

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
  - [Vercel (Frontend)](#vercel-frontend)
  - [cPanel + MySQL (Backend API)](#cpanel--mysql-backend-api)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Admin Portal](#admin-portal)
- [Available Scripts](#available-scripts)
- [Architecture Notes](#architecture-notes)
- [License](#license)

---

## Features

### Public Showroom
- **Flagship Landing Page** -- Cinematic SVG-clipped hero, live inventory catalog, featured "Just Landed" section, brand marquee, testimonials, and FAQ accordion
- **New Cars Catalog** -- Filterable showroom for brand-new exotic vehicles with advanced search
- **Used Cars Catalog** -- Certified pre-owned vehicles with inspection checklists
- **Vehicle Detail Pages** -- Full spec sheets (horsepower, top speed, 0-60, VIN, features, image gallery)
- **VIP Test Drive Booking** -- Date/time/location hub selection with concierge confirmation
- **Financing Calculator** -- Real-time loan estimation with bank partner info
- **Sell Your Car** -- Multi-step valuation wizard (vehicle info, condition, contact)
- **Contact Us** -- Enquiry form with 3 global showroom locations (Silicon Valley, Miami, London Mayfair)
- **Services Page** -- VIP test drives, worldwide enclosed delivery, financing, detailing/PPF
- **About Us** -- Leadership team, milestones timeline, global showroom footprint

### Admin Dashboard (Staff Portal)
- **Vehicle Inventory Management** -- Full CRUD, search, filter, availability toggle (Available/Reserved/Sold)
- **Landed/Featured Cars** -- Manage the "Browse What Just Landed" home section
- **Test Drive Management** -- View and manage customer bookings with call/WhatsApp outreach
- **Customer Enquiries** -- Lead management with status workflow (New/In Progress/Contacted/Closed)
- **Sell Car Requests** -- Valuation requests, offer management, convert-to-inventory

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 (SPA) |
| **Build Tool** | Vite 6 |
| **Language** | TypeScript 5.8 |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Motion (Framer Motion successor) |
| **Icons** | Lucide React |
| **State** | React Context + localStorage persistence |
| **Backend API** | PHP (PDO/MySQL) for cPanel hosting |
| **Database** | MySQL / MariaDB |

---

## Project Structure

```
Shah-Global-Motors/
├── public/
│   ├── .htaccess                  # Apache SPA fallback rules
│   ├── api/                       # PHP REST API backend
│   │   ├── .htaccess              # CORS headers
│   │   ├── config.php             # PDO connection + env loader
│   │   ├── schema.sql             # MySQL database schema
│   │   ├── auth.php               # Admin login (POST)
│   │   ├── vehicles.php           # Vehicle CRUD
│   │   ├── enquiries.php          # Enquiry CRUD
│   │   ├── test-drives.php        # Test drive CRUD
│   │   └── sell-requests.php      # Sell request CRUD
│   └── assets/                    # Static assets
│
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Root app: routing, modals, admin state
│   ├── types.ts                   # TypeScript interfaces
│   ├── index.css                  # Tailwind CSS imports
│   ├── context/
│   │   └── DealershipContext.tsx   # Global state: vehicles, enquiries, etc.
│   ├── components/
│   │   ├── Navbar.tsx             # Global navigation
│   │   ├── HeroSection.tsx        # Landing page hero
│   │   ├── FooterSection.tsx      # Global footer
│   │   ├── ShowroomCatalog.tsx    # Inventory catalog with filters
│   │   ├── AdminLoginPage.tsx     # Admin authentication
│   │   ├── AdminDashboard.tsx     # Full admin panel
│   │   ├── VehicleDetailModal.tsx # Quick vehicle overlay
│   │   ├── TestDriveModal.tsx     # Test drive booking modal
│   │   ├── SellCarModal.tsx       # Sell your car modal
│   │   ├── FinancingModal.tsx     # Financing calculator modal
│   │   ├── ContactModal.tsx       # Contact/enquiry modal
│   │   └── pages/
│   │       ├── HomePage.tsx       # Flagship landing page
│   │       ├── NewCarsPage.tsx    # New cars catalog
│   │       ├── UsedCarsPage.tsx   # Used cars catalog
│   │       ├── CarDetailsPage.tsx # Individual vehicle detail
│   │       ├── SellYourCarPage.tsx# Multi-step sell wizard
│   │       ├── ServicesPage.tsx   # Dealership services
│   │       ├── AboutUsPage.tsx    # Company info
│   │       └── ContactUsPage.tsx  # Contact form + locations
│   └── assets/images/             # 22 high-res vehicle images
│
├── .env.example                   # Environment variable template
├── index.html                     # Vite SPA entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
└── vercel.json                    # Vercel deployment config
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **MySQL/MariaDB** (for PHP API backend on cPanel)

### Installation

```bash
# Clone the repository
git clone https://github.com/Rabiaan/Shah-Global-Motors.git
cd Shah-Global-Motors

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Application
APP_URL="http://localhost:3000"

# Database (for PHP API on cPanel)
DB_HOST="localhost"
DB_NAME="shahglobal_db"
DB_USER="shahglobal_user"
DB_PASS="YourStrongPassword123!"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_EMAIL="admin@shahglobal.com"
ADMIN_PASSWORD="shahglobal2025"
ADMIN_ROLE="Super Admin"
ADMIN_DISPLAY_NAME="Shahglobal Senior Executive"
```

> **Security Note:** Never commit `.env` files to version control. The `.gitignore` is configured to exclude all `.env*` files except `.env.example`.

---

## Deployment

### Vercel (Frontend)

This project deploys as a **static SPA** on Vercel. The PHP API is served separately from cPanel.

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/Rabiaan/Shah-Global-Motors.git
   git branch -M main
   git push -u origin main
   ```

2. **Import on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the GitHub repository
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

3. **Environment Variables on Vercel:**
   - No environment variables needed for the frontend (all state is client-side localStorage)
   - If you later connect to the PHP API, set `VITE_API_URL` to your cPanel domain

4. **Deploy** -- Vercel auto-deploys on every push to `main`

> The `vercel.json` configures SPA rewrites so all routes serve `index.html`.

### cPanel + MySQL (Backend API)

The PHP API is designed for traditional cPanel/Apache hosting:

1. Upload the `public/api/` directory to your cPanel `public_html` folder
2. Create a MySQL database and user via cPanel MySQL Databases
3. Import `public/api/schema.sql` into your database
4. Create a `.env` file in the project root with your database credentials
5. The PHP API will automatically load credentials from `.env`

---

## Database Schema

5 tables managed via MySQL (see `public/api/schema.sql`):

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `admin_users` | Admin authentication | `username`, `password_hash`, `role` |
| `vehicles` | Vehicle inventory | `make`, `model`, `year`, `price`, `availability`, `vin` |
| `test_drives` | Test drive bookings | `vehicle_id`, `customer_name`, `preferred_date`, `status` |
| `enquiries` | Customer enquiries | `name`, `email`, `message`, `status` |
| `sell_requests` | Sell/trade-in requests | `make`, `model`, `expected_price`, `offer_amount`, `status` |

---

## API Endpoints

All endpoints are PHP files in `public/api/`:

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `auth.php` | `POST` | Admin login authentication |
| `vehicles.php` | `GET`, `POST`, `PUT`, `DELETE` | Vehicle CRUD operations |
| `enquiries.php` | `GET`, `POST`, `PUT`, `DELETE` | Customer enquiry CRUD |
| `test-drives.php` | `GET`, `POST`, `PUT`, `DELETE` | Test drive booking CRUD |
| `sell-requests.php` | `GET`, `POST`, `PUT`, `DELETE` | Sell request CRUD |

### Example: Get All Vehicles

```bash
GET /api/vehicles.php
```

### Example: Create Vehicle

```bash
POST /api/vehicles.php
Content-Type: application/json

{
  "make": "Porsche",
  "model": "911 GT3 RS",
  "year": 2025,
  "price": 320000,
  "mileage": 0,
  "engine": "4.0L Flat-6",
  "transmission": "PDK",
  "fuelType": "Petrol",
  "bodyType": "Coupe",
  "color": "Shark Blue",
  "category": "New",
  "availability": "Available"
}
```

---

## Admin Portal

Access the admin dashboard via the floating **ADMIN PORTAL** button (bottom-right corner).

**Default Credentials:**
- Username: `admin`
- Password: `shahglobal2025`

### Admin Modules

1. **Vehicle Inventory** -- Add, edit, delete, and toggle availability of vehicles
2. **Landed/Featured Cars** -- Manage the "Browse What Just Landed" showcase
3. **Test Drives** -- Review and manage customer test drive bookings
4. **Customer Enquiries** -- Track and respond to customer leads
5. **Sell Car Requests** -- Process valuation requests and make offers

---

## Available Scripts

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # TypeScript type checking (noEmit)
npm run clean     # Remove dist/ and server.js
```

---

## Architecture Notes

### State Management
- **React Context** (`DealershipContext`) provides global state for vehicles, enquiries, test drives, and sell requests
- All data persists in **localStorage** -- changes survive page refreshes
- No external state management library required

### Routing
- Client-side SPA routing using `window.location.pathname` and `history.pushState`
- Clean URLs: `/`, `/new-cars`, `/used-cars`, `/car-details`, `/sell-your-car`, `/services`, `/about-us`, `/contact-us`, `/admin`

### Frontend-Backend Split
- **Frontend (Vercel):** React SPA with localStorage state -- fully functional standalone
- **Backend (cPanel):** PHP REST API with MySQL -- optional, for persistent database storage
- The frontend operates independently of the PHP API

---

## License

All rights reserved. Shah Global Motors proprietary software.
