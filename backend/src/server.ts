import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomStore } from './models/Room';
import { BookingStore } from './models/Booking';
import { PricingService } from './services/PricingService';
import { BookingService } from './services/BookingService';
import { AnalyticsService } from './services/AnalyticsService';
import { RoomController } from './controllers/RoomController';
import { BookingController } from './controllers/BookingController';
import { AnalyticsController } from './controllers/AnalyticsController';
import { createRouter } from './routes';
import { seedRooms } from './scripts/seedData';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize stores
const roomStore = new RoomStore();
const bookingStore = new BookingStore();

// Seed initial data
seedRooms(roomStore);

// Initialize services
const pricingService = new PricingService();
const bookingService = new BookingService(bookingStore, roomStore, pricingService);
const analyticsService = new AnalyticsService(bookingStore, roomStore);

// Initialize controllers
const roomController = new RoomController(roomStore);
const bookingController = new BookingController(bookingService);
const analyticsController = new AnalyticsController(analyticsService);

// Routes
app.use('/api', createRouter(roomController, bookingController, analyticsController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌏 Timezone: ${process.env.TIMEZONE || 'Asia/Kolkata'}`);
});

export default app;

