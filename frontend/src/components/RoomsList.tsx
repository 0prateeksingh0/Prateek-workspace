import React, { useEffect, useState } from 'react';
import { Room } from '../types';
import { roomsApi } from '../api';

export const RoomsList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomsApi.getAllRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="card">
      <h2>Available Meeting Rooms</h2>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <h3>{room.name}</h3>
            <div className="room-info">
              <div className="room-info-item">
                <span className="room-info-label">Room ID:</span>
                <span className="room-info-value">{room.id}</span>
              </div>
              <div className="room-info-item">
                <span className="room-info-label">Base Rate:</span>
                <span className="room-info-value">₹{room.baseHourlyRate}/hr</span>
              </div>
              <div className="room-info-item">
                <span className="room-info-label">Capacity:</span>
                <span className="room-info-value">{room.capacity} people</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {rooms.length === 0 && (
        <div className="empty-state">
          <h3>No rooms available</h3>
          <p>Please contact the administrator.</p>
        </div>
      )}
    </div>
  );
};

