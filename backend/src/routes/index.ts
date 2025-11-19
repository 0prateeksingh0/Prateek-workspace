import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { BookingController } from '../controllers/BookingController';
import { AnalyticsController } from '../controllers/AnalyticsController';

export function createRouter(
  roomController: RoomController,
  bookingController: BookingController,
  analyticsController: AnalyticsController
): Router {
  const router = Router();

  // Room routes
  router.get('/rooms', roomController.getAllRooms);
  router.get('/rooms/:id', roomController.getRoom);

  // Booking routes
  router.post('/bookings', bookingController.createBooking);
  router.post('/bookings/:id/cancel', bookingController.cancelBooking);
  router.get('/bookings', bookingController.getAllBookings);

  // Analytics routes
  router.get('/analytics', analyticsController.getAnalytics);

  return router;
}

