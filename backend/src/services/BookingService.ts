import moment from 'moment-timezone';
import { Booking, BookingStatus, BookingStore } from '../models/Booking';
import { RoomStore } from '../models/Room';
import { PricingService } from './PricingService';

export interface CreateBookingRequest {
  roomId: string;
  userName: string;
  startTime: string;
  endTime: string;
}

export interface CreateBookingResponse {
  bookingId: string;
  roomId: string;
  userName: string;
  totalPrice: number;
  status: string;
}

export class BookingService {
  private readonly TIMEZONE = 'Asia/Kolkata';
  private readonly MAX_BOOKING_HOURS = 12;
  private readonly MIN_CANCELLATION_HOURS = 2;

  constructor(
    private bookingStore: BookingStore,
    private roomStore: RoomStore,
    private pricingService: PricingService
  ) {}

  /**
   * Creates a new booking with validation and conflict checking
   */
  async createBooking(request: CreateBookingRequest): Promise<CreateBookingResponse> {
    // Validate room exists
    const room = this.roomStore.getRoom(request.roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Parse and validate times
    const startTime = new Date(request.startTime);
    const endTime = new Date(request.endTime);

    this.validateBookingTimes(startTime, endTime);

    // Check for conflicts
    const conflict = this.checkConflict(request.roomId, startTime, endTime);
    if (conflict) {
      throw new Error(conflict);
    }

    // Calculate price
    const totalPrice = this.pricingService.calculatePrice(
      room.baseHourlyRate,
      startTime,
      endTime
    );

    // Create booking
    const booking: Booking = {
      bookingId: this.bookingStore.generateId(),
      roomId: request.roomId,
      userName: request.userName,
      startTime,
      endTime,
      totalPrice,
      status: BookingStatus.CONFIRMED,
      createdAt: new Date()
    };

    this.bookingStore.addBooking(booking);

    return {
      bookingId: booking.bookingId,
      roomId: booking.roomId,
      userName: booking.userName,
      totalPrice: booking.totalPrice,
      status: booking.status
    };
  }

  /**
   * Validates booking time constraints
   */
  private validateBookingTimes(startTime: Date, endTime: Date): void {
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error('Invalid date format');
    }

    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }

    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (durationHours > this.MAX_BOOKING_HOURS) {
      throw new Error(`Booking duration cannot exceed ${this.MAX_BOOKING_HOURS} hours`);
    }

    // Check if start time is in the past
    const now = moment().tz(this.TIMEZONE).toDate();
    if (startTime < now) {
      throw new Error('Cannot book in the past');
    }
  }

  /**
   * Checks for booking conflicts
   * Returns error message if conflict exists, null otherwise
   */
  private checkConflict(roomId: string, startTime: Date, endTime: Date): string | null {
    const existingBookings = this.bookingStore
      .getBookingsByRoom(roomId)
      .filter(b => b.status === BookingStatus.CONFIRMED);

    for (const booking of existingBookings) {
      // Check for overlap: new booking starts before existing ends AND new booking ends after existing starts
      if (startTime < booking.endTime && endTime > booking.startTime) {
        const conflictStart = moment(booking.startTime).tz(this.TIMEZONE).format('h:mm A');
        const conflictEnd = moment(booking.endTime).tz(this.TIMEZONE).format('h:mm A');
        return `Room already booked from ${conflictStart} to ${conflictEnd}`;
      }
    }

    return null;
  }

  /**
   * Cancels a booking if cancellation policy allows
   */
  async cancelBooking(bookingId: string): Promise<void> {
    const booking = this.bookingStore.getBooking(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error('Booking is already cancelled');
    }

    // Check if cancellation is allowed (> 2 hours before start time)
    const now = moment().tz(this.TIMEZONE);
    const startTime = moment(booking.startTime).tz(this.TIMEZONE);
    const hoursUntilStart = startTime.diff(now, 'hours', true);

    if (hoursUntilStart <= this.MIN_CANCELLATION_HOURS) {
      throw new Error('Cancellation must be made at least 2 hours before the booking start time');
    }

    // Update booking status
    booking.status = BookingStatus.CANCELLED;
    this.bookingStore.updateBooking(booking);
  }

  /**
   * Gets all bookings (for admin view)
   */
  getAllBookings(): Booking[] {
    return this.bookingStore.getAllBookings();
  }
}

