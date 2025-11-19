import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Booking, RoomAnalytics } from '../types';
import { bookingsApi, analyticsApi } from '../api';

const TIMEZONE = 'Asia/Kolkata';

export const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<RoomAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [dateRange, setDateRange] = useState({
    from: moment().tz(TIMEZONE).startOf('month').format('YYYY-MM-DD'),
    to: moment().tz(TIMEZONE).format('YYYY-MM-DD')
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsApi.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setSuccess(null);
      setError(null);
      await bookingsApi.cancelBooking(bookingId);
      setSuccess('Booking cancelled successfully');
      loadBookings(); // Reload bookings
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to cancel booking';
      setError(errorMessage);
    }
  };

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      setError(null);
      const data = await analyticsApi.getAnalytics(dateRange.from, dateRange.to);
      setAnalytics(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load analytics';
      setError(errorMessage);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return moment(dateString).tz(TIMEZONE).format('DD MMM YYYY, h:mm A');
  };

  const calculateTotalRevenue = () => {
    return analytics.reduce((sum, room) => sum + room.totalRevenue, 0);
  };

  const calculateTotalHours = () => {
    return analytics.reduce((sum, room) => sum + room.totalHours, 0).toFixed(1);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Bookings List */}
      <div className="card">
        <h2>All Bookings</h2>
        {bookings.length === 0 ? (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>Bookings will appear here once created.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Room</th>
                  <th>User Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>{booking.bookingId}</td>
                    <td>{booking.roomId}</td>
                    <td>{booking.userName}</td>
                    <td>{formatDateTime(booking.startTime)}</td>
                    <td>{formatDateTime(booking.endTime)}</td>
                    <td>₹{booking.totalPrice}</td>
                    <td>
                      <span className={`badge badge-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.status === 'CONFIRMED' && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelBooking(booking.bookingId)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="card">
        <h2>Analytics</h2>
        
        <div className="form-row" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label htmlFor="from">From Date</label>
            <input
              type="date"
              id="from"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="to">To Date</label>
            <input
              type="date"
              id="to"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={loadAnalytics}
          disabled={analyticsLoading}
        >
          {analyticsLoading ? 'Loading...' : '📊 Fetch Analytics'}
        </button>

        {analytics.length > 0 && (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-light)', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  ₹{calculateTotalRevenue()}
                </div>
                <div style={{ color: 'var(--text-gray)' }}>Total Revenue</div>
              </div>
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-light)', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                  {calculateTotalHours()}
                </div>
                <div style={{ color: 'var(--text-gray)' }}>Total Hours</div>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Room ID</th>
                    <th>Room Name</th>
                    <th>Total Hours</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((room) => (
                    <tr key={room.roomId}>
                      <td>{room.roomId}</td>
                      <td>{room.roomName}</td>
                      <td>{room.totalHours} hrs</td>
                      <td>₹{room.totalRevenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

