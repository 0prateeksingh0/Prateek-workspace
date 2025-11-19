import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Room } from '../types';
import { roomsApi, bookingsApi } from '../api';

const TIMEZONE = 'Asia/Kolkata';

export const BookingForm: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    roomId: '',
    userName: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomsApi.getAllRooms();
      setRooms(data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // Convert local datetime to ISO string
      const startTime = moment.tz(formData.startTime, TIMEZONE).toISOString();
      const endTime = moment.tz(formData.endTime, TIMEZONE).toISOString();

      const result = await bookingsApi.createBooking({
        roomId: formData.roomId,
        userName: formData.userName,
        startTime,
        endTime
      });

      setSuccess(
        `✅ Booking confirmed! Booking ID: ${result.bookingId} | Total Price: ₹${result.totalPrice}`
      );
      
      // Reset form
      setFormData({
        roomId: '',
        userName: '',
        startTime: '',
        endTime: ''
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create booking. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card">
      <h2>Book a Meeting Room</h2>
      
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="roomId">Select Room *</label>
          <select
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose a room --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (₹{room.baseHourlyRate}/hr - {room.capacity} people)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="userName">Your Name *</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time *</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Booking...' : '📅 Create Booking'}
        </button>
      </form>

      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>📌 Pricing Info:</h4>
        <ul style={{ marginLeft: '1.5rem', color: 'var(--text-gray)' }}>
          <li>Peak hours (10 AM–1 PM, 4 PM–7 PM Mon–Fri): 1.5× base rate</li>
          <li>Off-peak hours: base rate</li>
          <li>Maximum booking duration: 12 hours</li>
        </ul>
      </div>
    </div>
  );
};

