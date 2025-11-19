import moment from 'moment-timezone';
import { BookingStore, BookingStatus } from '../models/Booking';
import { RoomStore } from '../models/Room';

export interface RoomAnalytics {
  roomId: string;
  roomName: string;
  totalHours: number;
  totalRevenue: number;
}

export class AnalyticsService {
  private readonly TIMEZONE = 'Asia/Kolkata';

  constructor(
    private bookingStore: BookingStore,
    private roomStore: RoomStore
  ) {}

  /**
   * Generates analytics for all rooms within a date range
   * Only includes CONFIRMED bookings
   */
  getAnalytics(fromDate: string, toDate: string): RoomAnalytics[] {
    const from = moment.tz(fromDate, this.TIMEZONE).startOf('day');
    const to = moment.tz(toDate, this.TIMEZONE).endOf('day');

    // Validate dates
    if (!from.isValid() || !to.isValid()) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    if (from.isAfter(to)) {
      throw new Error('From date must be before or equal to date');
    }

    // Get all confirmed bookings in date range
    const bookings = this.bookingStore
      .getAllBookings()
      .filter(booking => {
        if (booking.status !== BookingStatus.CONFIRMED) {
          return false;
        }

        const bookingStart = moment(booking.startTime).tz(this.TIMEZONE);
        return bookingStart.isBetween(from, to, null, '[]');
      });

    // Aggregate by room
    const analyticsMap = new Map<string, RoomAnalytics>();

    for (const booking of bookings) {
      const room = this.roomStore.getRoom(booking.roomId);
      if (!room) continue;

      const durationHours = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60);

      if (!analyticsMap.has(booking.roomId)) {
        analyticsMap.set(booking.roomId, {
          roomId: booking.roomId,
          roomName: room.name,
          totalHours: 0,
          totalRevenue: 0
        });
      }

      const analytics = analyticsMap.get(booking.roomId)!;
      analytics.totalHours += durationHours;
      analytics.totalRevenue += booking.totalPrice;
    }

    // Round total hours to 1 decimal place
    const result = Array.from(analyticsMap.values()).map(analytics => ({
      ...analytics,
      totalHours: Math.round(analytics.totalHours * 10) / 10
    }));

    return result;
  }
}

