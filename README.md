# 🏢 Workspace Booking & Pricing System

A full-stack workspace booking system with dynamic pricing, conflict prevention, and analytics dashboard.

## 🚀 Live Demo

- **Frontend**: [Deployed on Netlify/Vercel]
- **Backend API**: [Deployed on Render/Railway]

## 📋 Features

✅ **Room Management**
- 5 pre-seeded meeting rooms with varying capacities and rates
- View all available rooms with pricing information

✅ **Smart Booking System**
- Real-time conflict detection
- Dynamic pricing (1.5× during peak hours: 10 AM–1 PM, 4 PM–7 PM Mon–Fri)
- Maximum 12-hour booking duration
- Timezone-aware (Asia/Kolkata)

✅ **Cancellation Policy**
- Cancel bookings with >2 hours notice before start time
- Automatic validation and error handling

✅ **Analytics Dashboard**
- Date-range based revenue and utilization reports
- Room-wise breakdown of total hours and revenue
- Only includes confirmed bookings

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Date/Time**: moment-timezone
- **Storage**: In-memory (production-ready schema)

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: Custom CSS

## 📦 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
TIMEZONE=Asia/Kolkata
```

Run the server:

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All Rooms
```http
GET /api/rooms
```

**Response:**
```json
[
  {
    "id": "101",
    "name": "Cabin 1",
    "baseHourlyRate": 300,
    "capacity": 4
  }
]
```

#### 2. Create Booking
```http
POST /api/bookings
Content-Type: application/json
```

**Request:**
```json
{
  "roomId": "101",
  "userName": "Priya",
  "startTime": "2025-11-20T10:00:00.000Z",
  "endTime": "2025-11-20T12:30:00.000Z"
}
```

**Success Response (201):**
```json
{
  "bookingId": "b1",
  "roomId": "101",
  "userName": "Priya",
  "totalPrice": 975,
  "status": "CONFIRMED"
}
```

**Conflict Response (409):**
```json
{
  "error": "Room already booked from 10:30 AM to 11:30 AM"
}
```

#### 3. Cancel Booking
```http
POST /api/bookings/:id/cancel
```

**Success Response (200):**
```json
{
  "message": "Booking cancelled successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Cancellation must be made at least 2 hours before the booking start time"
}
```

#### 4. Get All Bookings
```http
GET /api/bookings
```

**Response:**
```json
[
  {
    "bookingId": "b1",
    "roomId": "101",
    "userName": "Priya",
    "startTime": "2025-11-20T10:00:00.000Z",
    "endTime": "2025-11-20T12:30:00.000Z",
    "totalPrice": 975,
    "status": "CONFIRMED",
    "createdAt": "2025-11-19T08:00:00.000Z"
  }
]
```

#### 5. Get Analytics
```http
GET /api/analytics?from=2025-11-01&to=2025-11-30
```

**Response:**
```json
[
  {
    "roomId": "101",
    "roomName": "Cabin 1",
    "totalHours": 15.5,
    "totalRevenue": 5250
  }
]
```

## 🎯 Usage Examples

### Example 1: Peak Hour Booking

**Request:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "101",
    "userName": "John",
    "startTime": "2025-11-20T10:00:00.000Z",
    "endTime": "2025-11-20T11:00:00.000Z"
  }'
```

**Calculation:**
- Base rate: ₹300/hr
- Time: 10 AM (peak hour)
- Price: ₹300 × 1.5 × 1 hr = ₹450

### Example 2: Mixed Peak/Off-Peak

**Request:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "101",
    "userName": "Sarah",
    "startTime": "2025-11-20T12:30:00.000Z",
    "endTime": "2025-11-20T14:30:00.000Z"
  }'
```

**Calculation:**
- 12:30 PM – 1:00 PM (30 min peak): ₹300 × 1.5 × 0.5 = ₹225
- 1:00 PM – 2:30 PM (1.5 hr off-peak): ₹300 × 1.5 = ₹450
- **Total**: ₹675

## 🧪 Testing the Application

### Test Scenario 1: Successful Booking
1. Navigate to "Book Room" tab
2. Select "Cabin 1"
3. Enter your name
4. Choose a future date/time (e.g., tomorrow at 10 AM – 12 PM)
5. Click "Create Booking"
6. ✅ You should see a success message with booking ID and total price

### Test Scenario 2: Booking Conflict
1. Create a booking for Room 101, 10 AM – 11 AM
2. Try to create another booking for Room 101, 10:30 AM – 11:30 AM
3. ❌ You should see a conflict error

### Test Scenario 3: Cancellation Policy
1. Create a booking for tomorrow at 3 PM
2. Go to Admin Dashboard
3. Try to cancel the booking
4. ✅ Should cancel successfully (>2 hours notice)
5. Create a booking for 1 hour from now
6. Try to cancel
7. ❌ Should fail (violation of 2-hour policy)

### Test Scenario 4: Analytics
1. Create multiple bookings across different rooms
2. Go to Admin Dashboard
3. Select date range (e.g., current month)
4. Click "Fetch Analytics"
5. ✅ See aggregated revenue and hours per room

## 🚢 Deployment

### Backend (Render/Railway)

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `TIMEZONE=Asia/Kolkata`

### Frontend (Netlify/Vercel)

#### Netlify
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

#### Vercel
```bash
cd frontend
npm run build
# Import project from GitHub
# Framework: Vite
# Build command: npm run build
# Output directory: dist
```

Add environment variable:
- `VITE_API_URL=https://your-backend-url.onrender.com/api`

## 📁 Project Structure

```
craft/
├── backend/
│   ├── src/
│   │   ├── models/           # Data models (Room, Booking)
│   │   ├── services/         # Business logic (Pricing, Booking, Analytics)
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── scripts/          # Seed data
│   │   └── server.ts         # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── api.ts            # API client
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── ARCHITECTURE.md
```

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend has CORS enabled:
```typescript
app.use(cors());
```

### Date Format Issues
All dates should be in ISO 8601 format:
```
2025-11-20T10:00:00.000Z
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 👨‍💻 Development Notes

### Time Rounding
- Price calculations are done per minute for accuracy
- Final prices are rounded to the nearest rupee
- Duration in analytics is rounded to 1 decimal place

### Conflict Detection
- A booking conflicts if: `newStart < existingEnd AND newEnd > existingStart`
- End time = next start time is allowed (e.g., 11:00 AM end, 11:00 AM start)

### Timezone Handling
- All operations use Asia/Kolkata timezone
- Frontend sends ISO strings
- Backend processes with moment-timezone

## 📝 License

This project is created as part of a technical assessment.

## 🙏 Acknowledgments

Built with modern web technologies and best practices in clean architecture and TypeScript development.

