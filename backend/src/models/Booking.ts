export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Booking {
  bookingId: string;
  roomId: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}

export class BookingStore {
  private bookings: Map<string, Booking> = new Map();
  private nextId: number = 1;

  generateId(): string {
    return `b${this.nextId++}`;
  }

  addBooking(booking: Booking): void {
    this.bookings.set(booking.bookingId, booking);
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  getBookingsByRoom(roomId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(
      booking => booking.roomId === roomId
    );
  }

  updateBooking(booking: Booking): void {
    this.bookings.set(booking.bookingId, booking);
  }
}

