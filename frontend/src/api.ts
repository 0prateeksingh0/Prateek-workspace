import axios from 'axios';
import { Room, Booking, CreateBookingRequest, RoomAnalytics } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const roomsApi = {
  getAllRooms: async (): Promise<Room[]> => {
    const response = await api.get('/rooms');
    return response.data;
  }
};

export const bookingsApi = {
  createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    await api.post(`/bookings/${bookingId}/cancel`);
  }
};

export const analyticsApi = {
  getAnalytics: async (from: string, to: string): Promise<RoomAnalytics[]> => {
    const response = await api.get('/analytics', {
      params: { from, to }
    });
    return response.data;
  }
};

