# 🏗️ Architecture Documentation

**SYSTEM TEMPLATE FOR RAPID CODEBASE COMPREHENSION**

This document provides a comprehensive understanding of the Workspace Booking System's architecture, enabling efficient navigation and effective contribution.

---

## Table of Contents
1. [Project Identification](#1-project-identification)
2. [Project Structure](#2-project-structure)
3. [High-Level System Diagram](#3-high-level-system-diagram)
4. [Core Components](#4-core-components)
5. [Data Stores](#5-data-stores)
6. [Data Models](#6-data-models)
7. [Key Algorithms](#7-key-algorithms)
8. [API Design](#8-api-design)
9. [External Integrations](#9-external-integrations)
10. [Deployment & Infrastructure](#10-deployment--infrastructure)
11. [Security Considerations](#11-security-considerations)
12. [Development & Testing](#12-development--testing-environment)
13. [Scalability Considerations](#13-scalability-considerations)
14. [Future Roadmap](#14-future-considerations--roadmap)
15. [AI Usage Notes](#15-ai-usage-notes)
16. [Glossary](#16-glossary--acronyms)

---

## 1. Project Identification

**Project Name**: Workspace Booking & Pricing System  
**Repository URL**: https://github.com/0prateeksingh0/Prateek-workspace  
**Primary Contact**: [Your Name/Team]  
**Version**: 1.0.0  
**Date of Last Update**: November 19, 2025  
**Tech Stack**: Node.js + TypeScript | React | Express.js  
**License**: Proprietary (Assessment Project)

---

## 2. Project Structure

This section provides the complete directory structure of the workspace booking system, organized by architectural layer.

```
craft/
├── backend/                        # Server-side API (Node.js + TypeScript + Express)
│   ├── src/
│   │   ├── controllers/           # HTTP request handlers (MVC Controllers)
│   │   │   ├── RoomController.ts        # GET /rooms endpoints
│   │   │   ├── BookingController.ts     # POST /bookings, /cancel
│   │   │   └── AnalyticsController.ts   # GET /analytics
│   │   ├── services/              # Business logic layer
│   │   │   ├── BookingService.ts        # Booking creation, validation, cancellation
│   │   │   ├── PricingService.ts        # Dynamic pricing calculation
│   │   │   └── AnalyticsService.ts      # Revenue and utilization aggregation
│   │   ├── models/                # Data models and in-memory stores
│   │   │   ├── Room.ts                  # Room entity and RoomStore
│   │   │   └── Booking.ts               # Booking entity and BookingStore
│   │   ├── routes/                # API route definitions
│   │   │   └── index.ts                 # Centralized route configuration
│   │   ├── scripts/               # Utility scripts
│   │   │   └── seedData.ts              # Seeds 5 initial rooms
│   │   └── server.ts              # Application entry point
│   ├── package.json               # Backend dependencies
│   ├── tsconfig.json              # TypeScript configuration
│   └── .env                       # Environment variables (PORT, TIMEZONE)
│
├── frontend/                       # Client-side SPA (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   │   ├── RoomsList.tsx            # Display all available rooms
│   │   │   ├── BookingForm.tsx          # Create new bookings
│   │   │   └── AdminDashboard.tsx       # View bookings & analytics
│   │   ├── api.ts                 # Axios API client (centralized)
│   │   ├── types.ts               # TypeScript interfaces (Room, Booking, Analytics)
│   │   ├── App.tsx                # Main application with tab navigation
│   │   ├── App.css                # Global styles
│   │   └── main.tsx               # React entry point
│   ├── public/                    # Static assets
│   ├── package.json               # Frontend dependencies
│   ├── tsconfig.json              # TypeScript configuration
│   ├── vite.config.ts             # Vite build configuration
│   └── .env                       # Environment variables (VITE_API_URL)
│
├── docs/                           # Comprehensive documentation
│   ├── README.md                  # Usage guide, API docs, setup
│   ├── ARCHITECTURE.md            # This document
│   ├── DEPLOYMENT.md              # Deployment guide (Render/Netlify)
│   ├── QUICK_START.md             # 5-minute setup instructions
│   ├── VERIFICATION.md            # Testing checklist
│   └── PROJECT_SUMMARY.md         # Project overview
│
├── scripts/                        # Automation scripts
│   ├── setup.sh                   # Automated dependency installation
│   └── start-dev.sh               # Start both frontend & backend
│
├── .gitignore                      # Git ignore rules
└── .env                            # Root environment configuration
```

**Key Directories**:
- `backend/src/controllers/` - HTTP layer (request/response handling)
- `backend/src/services/` - Business logic layer (pure functions, no HTTP)
- `backend/src/models/` - Data access layer (storage abstraction)
- `frontend/src/components/` - UI layer (React components)

---

## 3. High-Level System Diagram

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         WORKSPACE BOOKING SYSTEM                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    Users     │         │   Browser    │         │   Internet   │
│ (Employees)  │ ───────►│  (Chrome,    │ ───────►│   (HTTPS)    │
│              │         │   Firefox)   │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
                                                           │
                                                           ▼
                         ┌─────────────────────────────────────┐
                         │      FRONTEND (React SPA)           │
                         │  - Rooms List View                  │
                         │  - Booking Form                     │
                         │  - Admin Dashboard                  │
                         │  Port: 3000 (dev) / CDN (prod)      │
                         └─────────────────────────────────────┘
                                        │
                                        │ HTTP/REST API
                                        │ (Axios Client)
                                        ▼
                         ┌─────────────────────────────────────┐
                         │      BACKEND API (Express.js)       │
                         │  ┌─────────────────────────────┐   │
                         │  │     Controllers Layer        │   │
                         │  │  (RoomController, etc.)      │   │
                         │  └─────────────┬────────────────┘   │
                         │                │                     │
                         │  ┌─────────────▼────────────────┐   │
                         │  │     Services Layer           │   │
                         │  │  - BookingService            │   │
                         │  │  - PricingService            │   │
                         │  │  - AnalyticsService          │   │
                         │  └─────────────┬────────────────┘   │
                         │                │                     │
                         │  ┌─────────────▼────────────────┐   │
                         │  │     Models Layer             │   │
                         │  │  - RoomStore (Map)           │   │
                         │  │  - BookingStore (Map)        │   │
                         │  └──────────────────────────────┘   │
                         │  Port: 5000                          │
                         └─────────────────────────────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────────────┐
                         │    IN-MEMORY DATA STORE             │
                         │  - Rooms (Map<string, Room>)        │
                         │  - Bookings (Map<string, Booking>)  │
                         │  * Data cleared on server restart   │
                         └─────────────────────────────────────┘

EXTERNAL DEPENDENCIES:
┌──────────────────┐
│  moment-timezone │  ← Used for Asia/Kolkata timezone handling
└──────────────────┘
```

### Data Flow Examples

**Example 1: Create Booking**
```
User → Frontend Form → POST /api/bookings → BookingController
  → BookingService.createBooking()
    → Validate times (startTime < endTime, ≤12 hrs)
    → Check conflicts (query BookingStore)
    → PricingService.calculatePrice() (dynamic pricing)
    → Store in BookingStore
  → Response: { bookingId, totalPrice, status }
→ Frontend: Display success message
```

**Example 2: Conflict Detection**
```
User → Try overlapping booking → BookingService.checkConflict()
  → Query existing bookings for room
  → Check: newStart < existingEnd && newEnd > existingStart
  → If true: Throw error "Room already booked from X to Y"
→ Frontend: Display conflict error (409 status)
```

---

## 4. Core Components

### 4.1. Frontend Application

**Name**: Workspace Booking Web App  
**Description**: Single-page application (SPA) that provides the user interface for viewing rooms, creating bookings, managing reservations, and viewing analytics. Users interact with three main views through a tabbed interface. Built with modern React practices including hooks and functional components.

**Technologies**: 
- React 18 (functional components with hooks)
- TypeScript (strict mode)
- Vite (build tool)
- Axios (HTTP client)
- moment-timezone (date handling)
- Custom CSS (responsive design)

**Deployment**: 
- Development: `http://localhost:3000` (Vite dev server)
- Production: Netlify or Vercel (CDN-backed, auto-scaling)

**Key Features**:
- Tabbed navigation (Rooms | Book Room | Admin Dashboard)
- Real-time form validation
- Loading states and error handling
- Responsive design (mobile-friendly)
- Color-coded status badges

---

### 4.2. Backend Services

#### 4.2.1. Booking Management API

**Name**: Workspace Booking API  
**Description**: RESTful API service that handles all business logic for room booking, conflict detection, dynamic pricing, cancellation policies, and analytics. Follows a clean architecture pattern with clear separation between controllers, services, and models.

**Technologies**: 
- Node.js v18+
- TypeScript (strict mode)
- Express.js (web framework)
- moment-timezone (timezone handling)
- CORS (cross-origin support)

**Deployment**: 
- Development: `http://localhost:5000`
- Production: Render, Railway, or Cyclic (containerized or serverless)

**Key Endpoints**:
- `GET /api/rooms` - List all available rooms
- `POST /api/bookings` - Create a new booking
- `POST /api/bookings/:id/cancel` - Cancel a booking
- `GET /api/bookings` - List all bookings (admin)
- `GET /api/analytics` - Get revenue/utilization analytics

**Business Rules Enforced**:
- Booking duration ≤ 12 hours
- No overlapping bookings (conflict detection)
- Dynamic pricing (1.5× during peak hours)
- Cancellation only if >2 hours before start
- Timezone: Asia/Kolkata

---

## 5. Data Stores

### 5.1. In-Memory Room Store

**Name**: RoomStore  
**Type**: In-memory Map (`Map<string, Room>`)  
**Purpose**: Stores all available meeting rooms with their base rates and capacities. Data is seeded on server startup and persists only during server lifetime.

**Key Schema**: 
```typescript
Room {
  id: string              // "101", "102", etc.
  name: string            // "Cabin 1", "Conference Room A"
  baseHourlyRate: number  // 300, 400, 600 (in rupees)
  capacity: number        // 4, 6, 10 (max people)
}
```

**Sample Data**: 5 pre-seeded rooms with varying rates (₹250-₹600/hr) and capacities (3-10 people)

**Operations**: 
- `addRoom()` - Seed room data
- `getRoom(id)` - Retrieve by ID
- `getAllRooms()` - List all rooms

---

### 5.2. In-Memory Booking Store

**Name**: BookingStore  
**Type**: In-memory Map (`Map<string, Booking>`)  
**Purpose**: Stores all bookings (confirmed and cancelled). Provides efficient lookup by booking ID and filtering by room ID for conflict detection.

**Key Schema**:
```typescript
Booking {
  bookingId: string       // "b1", "b2" (auto-generated)
  roomId: string          // Foreign key to Room
  userName: string        // User identifier
  startTime: Date         // Booking start (timezone-aware)
  endTime: Date           // Booking end (timezone-aware)
  totalPrice: number      // Pre-calculated price (rupees)
  status: BookingStatus   // CONFIRMED | CANCELLED
  createdAt: Date         // Audit timestamp
}
```

**Operations**:
- `addBooking()` - Store new booking
- `getBooking(id)` - Retrieve by ID
- `getAllBookings()` - List all bookings
- `getBookingsByRoom(roomId)` - Filter by room (for conflict checks)
- `updateBooking()` - Update status (for cancellation)

**Indexes**: None (in-memory, small dataset)

---

## 6. Data Models

### Technology Rationale

| Component | Choice | Reason |
|-----------|--------|--------|
| **Backend Framework** | Express.js | Lightweight, flexible, industry-standard for Node.js APIs |
| **Language** | TypeScript | Type safety, better IDE support, fewer runtime errors |
| **Date Library** | moment-timezone | Robust timezone handling for Asia/Kolkata operations |
| **Frontend** | React + Vite | Fast development, excellent DX, component reusability |
| **Storage** | In-Memory Maps | Assignment scope; easily replaceable with database |

Complete data model details with relationships and validation rules.

### Room Model

```typescript
interface Room {
  id: string;              // Unique identifier (e.g., "101")
  name: string;            // Display name (e.g., "Cabin 1")
  baseHourlyRate: number;  // Base rate in rupees (e.g., 300)
  capacity: number;        // Max occupancy (e.g., 4 people)
}
```

**Design Decisions:**
- `id` as string allows alphanumeric room codes
- `baseHourlyRate` serves as foundation for dynamic pricing
- `capacity` stored but not enforced (future feature)

### Booking Model

```typescript
interface Booking {
  bookingId: string;       // Auto-generated (e.g., "b1", "b2")
  roomId: string;          // Foreign key to Room
  userName: string;        // Simple user identification
  startTime: Date;         // Booking start (timezone-aware)
  endTime: Date;           // Booking end (timezone-aware)
  totalPrice: number;      // Pre-calculated price in rupees
  status: BookingStatus;   // CONFIRMED | CANCELLED
  createdAt: Date;         // Audit timestamp
}

enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}
```

**Design Decisions:**
- Price stored (not recalculated) for historical accuracy
- Status enum for extensibility (could add PENDING, COMPLETED)
- Soft delete via status (cancelled bookings retained for audit)

### Storage Layer

```typescript
class RoomStore {
  private rooms: Map<string, Room> = new Map();
  // CRUD operations
}

class BookingStore {
  private bookings: Map<string, Booking> = new Map();
  private nextId: number = 1;
  // CRUD operations + filtering
}
```

**Why Maps?**
- O(1) lookups by ID
- Easy to replace with database queries
- Type-safe iteration

---

## 7. Key Algorithms

### 7.1. Conflict Detection Algorithm

**Purpose**: Prevent overlapping bookings for the same room

**Algorithm**:
```typescript
function hasConflict(newStart: Date, newEnd: Date, existingBookings: Booking[]): boolean {
  for (const booking of existingBookings) {
    if (booking.status !== 'CONFIRMED') continue; // Skip cancelled bookings
    
    // Overlap condition: new booking starts before existing ends 
    // AND new booking ends after existing starts
    if (newStart < booking.endTime && newEnd > booking.startTime) {
      return true; // Conflict found
    }
  }
  return false; // No conflicts
}
```

**Time Complexity**: O(n) where n = number of bookings for that room  
**Space Complexity**: O(1)

**Edge Cases Handled**:
- End time equals next start time: **Allowed** (11:00 AM end, 11:00 AM start)
- Cancelled bookings: **Ignored** (only check CONFIRMED status)
- Past bookings: **Included** in check (prevents booking in the past indirectly)

**Visual Examples**:
```
Case 1: Adjacent (No Conflict)
Existing: |─────────|
New:                 |─────────|
         10:00    11:00      12:00
Result: ✅ No overlap

Case 2: Overlap (Conflict)  
Existing: |─────────|
New:          |─────────|
         10:00  10:30  11:30
Result: ❌ Conflict

Case 3: Enclosing (Conflict)
Existing:    |──────|
New:      |──────────────|
         9:00  10:00  12:00
Result: ❌ Conflict
```

---

### 7.2. Dynamic Pricing Algorithm

**Purpose**: Calculate booking price with peak/off-peak multipliers

**Peak Hours Definition**:
- **Days**: Monday-Friday only
- **Times**: 10:00 AM - 1:00 PM (10-13) OR 4:00 PM - 7:00 PM (16-19)
- **Multiplier**: 1.5×
- **Timezone**: Asia/Kolkata

**Algorithm**:
```typescript
function calculatePrice(baseRate: number, startTime: Date, endTime: Date): number {
  let totalPrice = 0;
  let currentMinute = moment(startTime).tz('Asia/Kolkata');
  const endMinute = moment(endTime).tz('Asia/Kolkata');
  
  // Iterate minute-by-minute
  while (currentMinute.isBefore(endMinute)) {
    const isPeak = isPeakHour(currentMinute);
    const rate = isPeak ? baseRate * 1.5 : baseRate;
    totalPrice += rate / 60; // Per-minute rate
    currentMinute.add(1, 'minute');
  }
  
  return Math.round(totalPrice);
}
```

**Time Complexity**: O(m) where m = duration in minutes  
**Typical Performance**: ~150 iterations for 2.5 hour booking

**Pricing Examples**:
```
Example 1: Pure Peak Hour
Room: Cabin 1 (₹300/hr)
Time: Monday 10:00 AM - 11:00 AM
Calc: ₹300 × 1.5 × 1 hr = ₹450

Example 2: Mixed Peak/Off-Peak
Room: Cabin 1 (₹300/hr)  
Time: Monday 12:30 PM - 2:30 PM
Breakdown:
  12:30-13:00 (30 min peak):    ₹300 × 1.5 × 0.5 = ₹225
  13:00-14:30 (90 min off-peak): ₹300 × 1.0 × 1.5 = ₹450
Total: ₹675

Example 3: Weekend (All Off-Peak)
Room: Cabin 1 (₹300/hr)
Time: Saturday 10:00 AM - 12:00 PM  
Calc: ₹300 × 1.0 × 2 hr = ₹600 (no peak multiplier on weekends)
```

---

### 7.3. Cancellation Policy Validation

**Rule**: Cancellation allowed only if >2 hours before booking start time

**Algorithm**:
```typescript
function canCancelBooking(booking: Booking, currentTime: Date): boolean {
  const hoursUntilStart = moment(booking.startTime)
    .diff(moment(currentTime), 'hours', true);
  
  return hoursUntilStart > 2; // Strictly greater than 2
}
```

**Edge Cases**:
- Exactly 2 hours before: **Not allowed** (must be >2, not ≥2)
- Past bookings: **Not allowed** (negative hours)
- Already cancelled: **Check performed** before calling this function

---

## 8. API Design

### 8.1. RESTful Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/rooms` | List all rooms | No |
| GET | `/api/rooms/:id` | Get specific room | No |
| POST | `/api/bookings` | Create booking | No |
| POST | `/api/bookings/:id/cancel` | Cancel booking | No |
| GET | `/api/bookings` | List all bookings | No |
| GET | `/api/analytics` | Get analytics | No |
| GET | `/health` | Health check | No |

**Note**: No authentication required per assignment spec (focus on logic, not auth)

---

### 8.2. Request/Response Examples

#### Create Booking
**Request**:
```http
POST /api/bookings
Content-Type: application/json

{
  "roomId": "101",
  "userName": "Priya",
  "startTime": "2025-11-20T10:00:00.000Z",
  "endTime": "2025-11-20T12:30:00.000Z"
}
```

**Success Response (201)**:
```json
{
  "bookingId": "b1",
  "roomId": "101",
  "userName": "Priya",
  "totalPrice": 975,
  "status": "CONFIRMED"
}
```

**Conflict Response (409)**:
```json
{
  "error": "Room already booked from 10:30 AM to 11:30 AM"
}
```

**Validation Error (400)**:
```json
{
  "error": "Booking duration cannot exceed 12 hours"
}
```

---

### 8.3. HTTP Status Codes Strategy

| Code | Usage | Examples |
|------|-------|----------|
| 200 OK | Successful read/update | GET rooms, Cancel booking |
| 201 Created | Resource created | Booking created |
| 400 Bad Request | Client validation error | Invalid date, duration >12hrs, <2hrs cancellation |
| 404 Not Found | Resource doesn't exist | Booking ID not found |
| 409 Conflict | Business logic conflict | Room already booked |
| 500 Internal Server Error | Unexpected error | Unhandled exceptions |

---

## 9. External Integrations / APIs

### 9.1. moment-timezone Library

**Service Name**: moment-timezone  
**Purpose**: Timezone-aware date/time handling for Asia/Kolkata timezone  
**Integration Method**: NPM package  
**Key Usage**:
- Parse ISO dates to IST
- Check if hour is in peak time
- Format dates for display
- Calculate duration differences

**Example**:
```typescript
const istTime = moment.tz("2025-11-20T10:00:00.000Z", "Asia/Kolkata");
const hour = istTime.hour(); // 15 (3 PM IST = 10 AM UTC + 5.5 hrs)
```

**Note**: No other external APIs required (self-contained system)

---

## 10. Deployment & Infrastructure

### 10.1. Development Environment

**Backend**:
- Runtime: Node.js v18+
- Package Manager: npm
- Start Command: `npm run dev` (ts-node-dev with hot reload)
- Port: 5000
- Environment: `.env` file with PORT, TIMEZONE

**Frontend**:
- Build Tool: Vite
- Dev Server: `npm run dev` (HMR enabled)
- Port: 3000
- Proxy: API requests to `http://localhost:5000`

---

### 10.2. Production Deployment

**Cloud Provider**: Platform-agnostic (Render, Railway, Netlify, Vercel)

#### Backend Deployment (Recommended: Render)

**Platform**: Render.com (free tier)  
**Key Services Used**:
- Web Service (Docker container or native Node.js)
- Auto-deploy from GitHub
- Environment variables management

**Build Configuration**:
```yaml
Build Command: npm install && npm run build
Start Command: npm start
Environment Variables:
  - PORT=5000
  - NODE_ENV=production
  - TIMEZONE=Asia/Kolkata
```

**Alternative Platforms**:
- Railway.app (stays warm longer)
- Cyclic.sh (serverless)
- AWS EC2 / Elastic Beanstalk
- Google Cloud Run
- Heroku (paid)

---

#### Frontend Deployment (Recommended: Netlify)

**Platform**: Netlify (free tier with CDN)  
**Key Services Used**:
- Static site hosting
- Continuous deployment from GitHub
- CDN (global edge network)
- Automatic HTTPS

**Build Configuration**:
```yaml
Base Directory: frontend
Build Command: npm run build
Publish Directory: frontend/dist
Environment Variables:
  - VITE_API_URL=https://your-backend.onrender.com/api
```

**Alternative Platforms**:
- Vercel (excellent Vite support)
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages (with build step)

---

### 10.3. CI/CD Pipeline

**Current**: Manual deployment (GitHub → Render/Netlify)  
**Recommended Future**:
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Run tests
      - Deploy to Render
  frontend:
    runs-on: ubuntu-latest  
    steps:
      - Checkout code
      - Build React app
      - Deploy to Netlify
```

---

### 10.4. Monitoring & Logging

**Development**: Console logs  
**Production Recommended**:
- **Monitoring**: Render built-in metrics, UptimeRobot (health checks)
- **Logging**: Render logs viewer, Papertrail
- **Error Tracking**: Sentry (future enhancement)
- **Analytics**: Google Analytics on frontend (future)

---

## 11. Security Considerations

### 11.1. Current Implementation

**Authentication**: None (per assignment requirements)  
**Authorization**: None (all endpoints public)  
**Data Encryption**: 
- **In Transit**: HTTPS (when deployed)
- **At Rest**: N/A (in-memory store)

**Input Validation**:
- Required field checks
- Date format validation (ISO 8601)
- Duration limits (≤12 hours)
- Room ID existence checks

---

### 11.2. Production Hardening Recommendations

**For Production Deployment**:

1. **Authentication** (Add JWT):
```typescript
import jwt from 'jsonwebtoken';
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};
```

2. **Rate Limiting**:
```typescript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});
app.use('/api/', limiter);
```

3. **Input Sanitization**:
```typescript
import { body, validationResult } from 'express-validator';
app.post('/api/bookings', [
  body('userName').trim().escape(),
  body('roomId').isAlphanumeric(),
], createBooking);
```

4. **CORS Configuration**:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 12. Development & Testing Environment

### 12.1. Local Setup Instructions

**Quick Start**:
```bash
# Automated setup
chmod +x setup.sh
./setup.sh

# Start both servers
./start-dev.sh
```

**Manual Setup**:
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend  
npm install
npm run dev
```

**Full Guide**: See `QUICK_START.md`

---

### 12.2. Testing Frameworks

**Current**: Manual testing (see `VERIFICATION.md`)  
**Recommended Future**:

**Backend**:
- **Unit Tests**: Jest + ts-jest
- **Integration Tests**: Supertest (API testing)
- **Coverage Target**: >80%

```typescript
// Example: PricingService.test.ts
describe('PricingService', () => {
  it('applies 1.5x multiplier during peak hours', () => {
    const price = pricingService.calculatePrice(
      300, // base rate
      moment('2025-11-20T10:00:00+05:30'), // Monday 10 AM IST (peak)
      moment('2025-11-20T11:00:00+05:30')
    );
    expect(price).toBe(450); // 300 * 1.5 * 1 hr
  });
});
```

**Frontend**:
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright or Cypress

---

### 12.3. Code Quality Tools

**Linting**: 
- ESLint (TypeScript rules)
- Prettier (code formatting)

**Type Checking**:
- TypeScript strict mode enabled
- No `any` types (except error handlers)

**Pre-commit Hooks** (Recommended):
```json
// package.json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.ts": ["eslint --fix", "prettier --write"]
}
```

---

## 13. Scalability Considerations

### Layered Architecture

```
┌──────────────────────────────────────┐
│         Controllers Layer            │  ← HTTP Request/Response
│  (RoomController, BookingController) │     Error handling
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│         Services Layer               │  ← Business Logic
│  (BookingService, PricingService)    │     Validation
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│         Models Layer                 │  ← Data Access
│  (RoomStore, BookingStore)           │     State Management
└──────────────────────────────────────┘
```

### Responsibilities

#### Controllers
- Parse HTTP requests
- Validate request format
- Call appropriate service methods
- Return HTTP responses with proper status codes

```typescript
async createBooking(req: Request, res: Response) {
  try {
    const booking = await this.bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    // Error mapping to status codes
  }
}
```

#### Services
- Implement business rules
- Coordinate between models
- Throw domain-specific errors

```typescript
class BookingService {
  async createBooking(request: CreateBookingRequest) {
    this.validateBookingTimes(startTime, endTime);
    this.checkConflict(roomId, startTime, endTime);
    const totalPrice = this.pricingService.calculatePrice(...);
    // Create and store booking
  }
}
```

#### Models (Stores)
- Data persistence
- Simple CRUD operations
- No business logic

---

## Conflict Detection Logic

### Algorithm

Two bookings conflict if their time ranges overlap. The overlap condition:

```typescript
function hasOverlap(new: Booking, existing: Booking): boolean {
  return newStart < existing.endTime && newEnd > existing.startTime;
}
```

### Visual Explanation

```
Case 1: No Conflict (end = next start is allowed)
Existing:  |─────────|
New:                  |─────────|
           10:00    11:00     12:00
Result: ✅ Allowed (11:00 end, 11:00 start)

Case 2: Conflict (overlap)
Existing:  |─────────|
New:           |─────────|
           10:00  10:30  11:30
Result: ❌ "Room already booked from 10:00 AM to 11:00 AM"

Case 3: No Conflict (completely separate)
Existing:  |─────────|
New:                      |─────────|
           10:00    11:00  12:00  13:00
Result: ✅ Allowed
```

### Implementation

```typescript
private checkConflict(roomId: string, startTime: Date, endTime: Date): string | null {
  const existingBookings = this.bookingStore
    .getBookingsByRoom(roomId)
    .filter(b => b.status === BookingStatus.CONFIRMED);

  for (const booking of existingBookings) {
    // Overlap detection
    if (startTime < booking.endTime && endTime > booking.startTime) {
      return `Room already booked from ${formatTime(booking.startTime)} to ${formatTime(booking.endTime)}`;
    }
  }
  return null;
}
```

**Edge Cases Handled:**
- Only checks CONFIRMED bookings (ignores CANCELLED)
- Boundary condition: end = start is not a conflict
- Clear error messages with exact conflict times

---

## Dynamic Pricing Method

### Pricing Rules

| Time Slot | Days | Multiplier |
|-----------|------|------------|
| 10 AM – 1 PM | Mon–Fri | 1.5× |
| 4 PM – 7 PM | Mon–Fri | 1.5× |
| All other times | All days | 1.0× |
| Weekends | Sat–Sun | 1.0× |

### Algorithm

```typescript
calculatePrice(baseRate: number, startTime: Date, endTime: Date): number {
  const start = moment(startTime).tz('Asia/Kolkata');
  const end = moment(endTime).tz('Asia/Kolkata');
  
  let totalPrice = 0;
  let current = start.clone();

  // Iterate minute-by-minute
  const totalMinutes = end.diff(start, 'minutes');
  
  for (let i = 0; i < totalMinutes; i++) {
    const isPeak = this.isPeakHour(current.toDate());
    const rate = isPeak ? baseRate * 1.5 : baseRate;
    totalPrice += rate / 60;  // Proportional per minute
    current.add(1, 'minute');
  }

  return Math.round(totalPrice);
}
```

### Pricing Examples

#### Example 1: Pure Peak Hour
```
Room: Cabin 1 (₹300/hr)
Time: Mon, 10:00 AM – 11:00 AM
Calculation: ₹300 × 1.5 × 1 = ₹450
```

#### Example 2: Mixed (Peak + Off-Peak)
```
Room: Cabin 1 (₹300/hr)
Time: Mon, 12:30 PM – 2:30 PM
Breakdown:
  - 12:30 PM – 1:00 PM (30 min peak): ₹300 × 1.5 × 0.5 = ₹225
  - 1:00 PM – 2:30 PM (90 min off-peak): ₹300 × 1.5 = ₹450
Total: ₹675
```

#### Example 3: Overnight (Crosses Midnight)
```
Room: Conference Room A (₹600/hr)
Time: Mon, 11:00 PM – Tue, 1:00 AM (2 hours)
All off-peak (night hours)
Calculation: ₹600 × 2 = ₹1200
```

### Why Minute-Level Granularity?

- **Accuracy**: Handles partial hours precisely
- **Fairness**: Users pay exactly for time used
- **Simplicity**: No complex rounding rules
- **Extensibility**: Easy to adjust pricing windows

---

## Frontend Architecture

### Component Structure

```
App.tsx (Main container)
├── RoomsList.tsx          (Display available rooms)
├── BookingForm.tsx        (Create new bookings)
└── AdminDashboard.tsx     (View bookings + analytics)
```

### State Management

- **Local State**: Each component manages its own state with `useState`
- **No Global State**: Simple enough for prop drilling/lifting
- **API Layer**: Centralized in `api.ts` for consistency

### API Client

```typescript
// api.ts
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const bookingsApi = {
  createBooking: async (data) => { /* ... */ },
  cancelBooking: async (id) => { /* ... */ },
  getAllBookings: async () => { /* ... */ }
};
```

**Benefits:**
- Single source of truth for API calls
- Easy to add interceptors (auth, logging)
- Type-safe with TypeScript interfaces

### User Experience Considerations

1. **Instant Feedback**: Loading states on all async operations
2. **Clear Errors**: User-friendly error messages from API
3. **Responsive Design**: Mobile-first CSS with grid/flexbox
4. **Visual Hierarchy**: Color-coded status badges, clear CTAs

---

## API Design Decisions

### RESTful Principles

| Method | Endpoint | Purpose | Idempotent? |
|--------|----------|---------|-------------|
| GET | `/api/rooms` | List all rooms | Yes |
| POST | `/api/bookings` | Create booking | No |
| POST | `/api/bookings/:id/cancel` | Cancel booking | Yes |
| GET | `/api/bookings` | List all bookings | Yes |
| GET | `/api/analytics` | Get analytics | Yes |

### Status Code Strategy

| Code | Usage | Example |
|------|-------|---------|
| 200 | Success (read/update) | Get rooms, cancel booking |
| 201 | Resource created | Booking created |
| 400 | Client error (validation) | Invalid date format |
| 404 | Resource not found | Booking ID doesn't exist |
| 409 | Conflict | Room already booked |
| 500 | Server error | Unexpected exception |

### Error Response Format

```json
{
  "error": "Human-readable message explaining what went wrong"
}
```

**Design Choice:**
- Simple string errors (not error codes)
- Descriptive for debugging
- Safe for client display

---

## Scalability Considerations

### Current Limitations (In-Memory Store)

1. **Data Loss**: Server restart clears all data
2. **No Horizontal Scaling**: Single instance only
3. **No Persistence**: No audit trail
4. **Memory Constraints**: Limited by Node.js heap

### Database Migration Path

#### Recommended: PostgreSQL

```sql
-- Rooms Table
CREATE TABLE rooms (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  base_hourly_rate INTEGER NOT NULL,
  capacity INTEGER NOT NULL
);

-- Bookings Table
CREATE TABLE bookings (
  booking_id VARCHAR(50) PRIMARY KEY,
  room_id VARCHAR(50) REFERENCES rooms(id),
  user_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  total_price INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for conflict checking
CREATE INDEX idx_bookings_room_time 
ON bookings(room_id, start_time, end_time, status);
```

**Benefits:**
- ACID transactions for conflict prevention
- `TIMESTAMPTZ` for timezone-aware storage
- Indexed queries for fast conflict detection

#### Conflict Detection with SQL

```sql
-- Check for conflicts (more efficient than application code)
SELECT booking_id, start_time, end_time
FROM bookings
WHERE room_id = $1
  AND status = 'CONFIRMED'
  AND start_time < $3  -- new end time
  AND end_time > $2;   -- new start time
```

### Horizontal Scaling Strategies

1. **Stateless API**: Already achieved (no session state)
2. **Load Balancer**: Distribute requests across multiple instances
3. **Distributed Locking**: Use Redis for atomic conflict checks
4. **Database Read Replicas**: Separate reads (analytics) from writes (bookings)

### Caching Strategy

```typescript
// Redis cache for room data (rarely changes)
GET /api/rooms → Check Redis → If miss, query DB → Cache for 1 hour

// No caching for bookings (real-time conflicts)
POST /api/bookings → Always query DB for fresh data
```

### Event-Driven Architecture (Future)

```
Booking Created Event → 
  ├─ Send Email Confirmation
  ├─ Update Calendar Integration
  └─ Log Analytics Event

Booking Cancelled Event →
  ├─ Refund Processing (if applicable)
  └─ Notify Stakeholders
```

---

## AI Usage Notes

### How AI Was Used

This project was built with assistance from AI tools (GitHub Copilot, ChatGPT, Cursor). Here's how:

#### 1. **Boilerplate Generation** (30%)
- TypeScript configuration (`tsconfig.json`)
- Express server setup with middleware
- React component scaffolding

**Example Prompt:**
> "Create a TypeScript Express server with CORS, JSON parsing, and a health check endpoint"

#### 2. **Algorithm Implementation** (40%)
- Dynamic pricing logic (minute-by-minute calculation)
- Conflict detection algorithm
- Date/timezone handling with moment-timezone

**Example Prompt:**
> "Write a function to calculate booking price where peak hours (10 AM–1 PM, 4 PM–7 PM Mon–Fri) are 1.5× the base rate. Handle timezone Asia/Kolkata."

#### 3. **CSS Styling** (20%)
- Modern, responsive UI components
- Color scheme and layout
- Table and form styling

**Example Prompt:**
> "Create a modern, professional CSS style for a booking system with purple gradient header, card layouts, and responsive tables"

#### 4. **Documentation** (10%)
- README structure
- API examples
- Architecture explanations

### What I Brought (Human Contribution)

1. **Architecture Decisions**
   - Layered separation (controllers/services/models)
   - API endpoint design
   - Data model structure

2. **Business Logic**
   - Conflict detection algorithm reasoning
   - Cancellation policy enforcement
   - Analytics aggregation logic

3. **Code Review & Refinement**
   - Added error handling edge cases
   - Improved type safety
   - Optimized conflict checking (filter cancelled bookings)

4. **Testing & Debugging**
   - Verified pricing calculations manually
   - Tested timezone edge cases
   - Fixed CORS issues

### AI Limitations Encountered

1. **Timezone Confusion**: AI initially used UTC without timezone conversion
   - **Fix**: Explicitly specified `moment.tz('Asia/Kolkata')` everywhere

2. **Conflict Logic Bug**: First version didn't exclude cancelled bookings
   - **Fix**: Added status filter in conflict check

3. **Incomplete Error Handling**: Missing validation for past dates
   - **Fix**: Added `if (startTime < now)` check

### Lessons Learned

✅ **AI Excels At:**
- Repetitive code (CRUD operations)
- Standard patterns (Express routes, React components)
- CSS layout and styling

❌ **AI Struggles With:**
- Complex business logic (conflict detection)
- Timezone edge cases
- Production-ready error handling

🧠 **Best Practice:**
- Use AI for speed, human review for correctness
- Validate all AI-generated logic with test cases
- Refactor generated code for readability

---

## Security Considerations (Future)

### Current State
- No authentication (as per requirements)
- No input sanitization (vulnerable to injection)
- No rate limiting

### Production Hardening Checklist

```typescript
// 1. Input Validation
import { body, validationResult } from 'express-validator';

app.post('/api/bookings', [
  body('userName').trim().escape().isLength({ min: 2, max: 100 }),
  body('roomId').isAlphanumeric(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601()
], createBooking);

// 2. Rate Limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.use('/api/', limiter);

// 3. Authentication (JWT)
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};
```

---

## Conclusion

This system demonstrates:

✅ **Clean Architecture**: Clear separation of concerns (MVC pattern)  
✅ **Type Safety**: TypeScript throughout for fewer runtime errors  
✅ **Business Logic**: Complex pricing and conflict detection  
✅ **API Design**: RESTful, predictable, well-documented  
✅ **User Experience**: Responsive, intuitive, error-friendly  
✅ **Scalability**: Modular design ready for database migration  

### Next Steps for Production

1. **Database Integration** (PostgreSQL + TypeORM)
2. **Authentication** (JWT with role-based access)
3. **Email Notifications** (SendGrid/Nodemailer)
4. **Unit Tests** (Jest for services, React Testing Library)
5. **CI/CD Pipeline** (GitHub Actions → Deploy on merge)
6. **Monitoring** (Sentry for errors, DataDog for metrics)

---

## 14. Future Considerations / Roadmap

### Phase 1: Foundation (Current - ✅ Complete)
- ✅ Core booking functionality
- ✅ Dynamic pricing
- ✅ Conflict detection
- ✅ Basic analytics
- ✅ Clean architecture

### Phase 2: Database Migration (Next 2-4 weeks)
- [ ] Replace in-memory stores with PostgreSQL
- [ ] Add database migrations (Sequelize/TypeORM)
- [ ] Implement connection pooling
- [ ] Add indexes for conflict queries
- [ ] Data persistence and backup

### Phase 3: Authentication & Authorization (4-6 weeks)
- [ ] User registration/login (JWT)
- [ ] Role-based access control (Admin, Employee)
- [ ] User-specific booking history
- [ ] Admin-only analytics access

### Phase 4: Advanced Features (2-3 months)
- [ ] Email notifications (SendGrid)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Recurring bookings
- [ ] Booking approval workflow
- [ ] Room amenities (projector, whiteboard, etc.)
- [ ] Capacity enforcement

### Phase 5: Scale & Performance (3-6 months)
- [ ] Migrate to microservices architecture
- [ ] Event-driven architecture (Kafka/RabbitMQ)
- [ ] Redis caching layer
- [ ] Horizontal scaling (load balancer)
- [ ] Read replicas for analytics

### Technical Debt / Known Limitations

1. **No Persistence**: In-memory store cleared on restart
   - **Impact**: High (data loss)
   - **Solution**: PostgreSQL migration (Phase 2)

2. **No Authentication**: All endpoints public
   - **Impact**: Medium (security risk)
   - **Solution**: JWT auth (Phase 3)

3. **Linear Conflict Check**: O(n) per booking
   - **Impact**: Low (small dataset)
   - **Solution**: Database indexes + optimized queries (Phase 2)

4. **No Concurrent Booking Protection**: Race condition possible
   - **Impact**: Low (unlikely in low-traffic)
   - **Solution**: Database transactions + row-level locking (Phase 2)

5. **No Error Monitoring**: Console logs only
   - **Impact**: Medium (hard to debug production)
   - **Solution**: Sentry integration (Phase 4)

---

## 15. AI Usage Notes

### How AI Assisted in Development

This project was built with AI assistance (GitHub Copilot, ChatGPT, Cursor). Here's the breakdown:

#### AI Contributions (~60%)

**1. Boilerplate & Setup (25%)**
- TypeScript configuration files
- Express server setup with middleware
- React component structure
- Package.json dependencies

**Example Prompt**: 
> "Create a TypeScript Express server with CORS, JSON parsing, health check endpoint, and moment-timezone for Asia/Kolkata"

**2. Algorithm Implementation (20%)**
- Dynamic pricing logic skeleton
- Conflict detection base algorithm
- Date/time calculations

**Example Prompt**:
> "Write a function to calculate booking price where peak hours (10 AM-1 PM, 4 PM-7 PM Mon-Fri) are 1.5x base rate, handle Asia/Kolkata timezone, calculate minute-by-minute"

**3. UI/CSS Styling (15%)**
- Responsive layout CSS
- Purple gradient header
- Card and table styles
- Color scheme

**Example Prompt**:
> "Create modern CSS for booking system: purple gradient header, card layout for rooms, responsive tables, color-coded badges (green=confirmed, red=cancelled)"

---

#### Human Contributions (~40%)

**1. Architecture Decisions (15%)**
- Layered separation (Controllers → Services → Models)
- API endpoint design philosophy
- Data model structure and relationships
- Technology stack selection rationale

**2. Business Logic Refinement (15%)**
- Conflict detection edge cases:
  - Excluding cancelled bookings from conflict checks
  - Allowing adjacent bookings (end = next start)
  - Preventing past bookings
- Cancellation policy enforcement (>2 hours, not ≥2)
- Analytics aggregation (room-wise grouping)
- Error message clarity

**3. Code Review & Debugging (10%)**
- Fixed timezone bugs (UTC vs IST confusion)
- Added missing validation (past dates, duration limits)
- Improved error handling (proper status codes)
- Type safety enhancements (removed `any` types)

---

### AI Limitations Encountered

**1. Timezone Handling**
- **Issue**: AI initially used UTC without timezone conversion
- **Symptom**: Peak hour pricing applied at wrong times
- **Fix**: Explicitly added `moment.tz('Asia/Kolkata')` everywhere

**2. Business Logic Edge Cases**
- **Issue**: Conflict check didn't exclude cancelled bookings
- **Symptom**: Conflict errors for cancelled bookings
- **Fix**: Added `filter(b => b.status === 'CONFIRMED')`

**3. Validation Gaps**
- **Issue**: Missing check for booking in the past
- **Symptom**: Users could book yesterday
- **Fix**: Added `if (startTime < now)` validation

**4. Error Response Consistency**
- **Issue**: Mix of error formats (string vs object)
- **Symptom**: Frontend couldn't parse some errors
- **Fix**: Standardized to `{ error: "message" }` format

---

### Best Practices for AI-Assisted Development

✅ **What Worked Well**:
- Use AI for repetitive code (CRUD, boilerplate)
- Let AI generate CSS layouts and styling
- Ask AI for standard patterns (Express routing, React hooks)
- Use AI for documentation templates

❌ **What Needed Human Oversight**:
- Complex business logic (pricing, conflicts)
- Edge case handling
- Security considerations
- Performance optimization
- Architecture decisions

🧠 **Lessons Learned**:
1. **Validate Everything**: AI code needs thorough testing
2. **Ask Specific Questions**: Better prompts = better code
3. **Refactor AI Code**: Generated code is starting point, not final product
4. **Understand, Don't Copy**: Know why the code works
5. **Test Edge Cases**: AI often misses boundary conditions

---

### AI Tools Used

| Tool | Usage | Effectiveness |
|------|-------|---------------|
| GitHub Copilot | Autocomplete, boilerplate | ⭐⭐⭐⭐⭐ |
| ChatGPT | Algorithm logic, debugging | ⭐⭐⭐⭐ |
| Cursor | Code generation, refactoring | ⭐⭐⭐⭐⭐ |

---

## 16. Glossary / Acronyms

**API**: Application Programming Interface - how frontend talks to backend  
**CORS**: Cross-Origin Resource Sharing - allows frontend (port 3000) to call backend (port 5000)  
**CRUD**: Create, Read, Update, Delete - basic data operations  
**DTO**: Data Transfer Object - interface for request/response data  
**HMR**: Hot Module Replacement - Vite feature for instant updates  
**IST**: Indian Standard Time (Asia/Kolkata timezone, UTC+5:30)  
**JWT**: JSON Web Token - authentication method (not implemented, but recommended)  
**MVC**: Model-View-Controller - architectural pattern (Controllers-Services-Models in this project)  
**O(n)**: Big O notation - time complexity (linear time)  
**ORM**: Object-Relational Mapping - library for database queries (future: Sequelize/TypeORM)  
**REST**: Representational State Transfer - API design style  
**SPA**: Single-Page Application - React frontend  
**TS**: TypeScript - typed superset of JavaScript  
**UTC**: Coordinated Universal Time - standard timezone (converted to IST in app)

**Project-Specific Terms**:
- **Peak Hours**: Mon-Fri 10 AM-1 PM & 4 PM-7 PM (IST) with 1.5× pricing
- **Off-Peak**: All other times with 1.0× (base rate) pricing  
- **Conflict**: Two bookings for same room with overlapping times
- **Cancellation Window**: Minimum 2 hours before booking start time
- **Base Hourly Rate**: Room's standard price (e.g., ₹300/hr for Cabin 1)
- **Dynamic Pricing**: Variable pricing based on time and day
- **Booking ID**: Auto-generated unique identifier (e.g., "b1", "b2")

---

**Document Version**: 2.0 (Updated with full template)  
**Last Updated**: November 19, 2025  
**Maintained By**: Project Team  
**Built with care for clean code and engineering excellence.** 🚀

