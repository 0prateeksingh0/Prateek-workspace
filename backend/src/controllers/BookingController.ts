import { Request, Response } from 'express';
import { BookingService } from '../services/BookingService';

export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * POST /api/bookings - Create a new booking
   */
  createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId, userName, startTime, endTime } = req.body;

      // Validate required fields
      if (!roomId || !userName || !startTime || !endTime) {
        res.status(400).json({ error: 'Missing required fields: roomId, userName, startTime, endTime' });
        return;
      }

      const booking = await this.bookingService.createBooking({
        roomId,
        userName,
        startTime,
        endTime
      });

      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof Error) {
        // Check for conflict errors
        if (error.message.includes('already booked')) {
          res.status(409).json({ error: error.message });
          return;
        }
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /**
   * POST /api/bookings/:id/cancel - Cancel a booking
   */
  cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.bookingService.cancelBooking(req.params.id);
      res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('at least 2 hours')) {
          res.status(400).json({ error: error.message });
          return;
        }
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /**
   * GET /api/bookings - Get all bookings
   */
  getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookings = this.bookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

