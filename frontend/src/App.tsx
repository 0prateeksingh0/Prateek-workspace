import React, { useState } from 'react';
import { RoomsList } from './components/RoomsList';
import { BookingForm } from './components/BookingForm';
import { AdminDashboard } from './components/AdminDashboard';
import './App.css';

type Tab = 'rooms' | 'booking' | 'admin';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('rooms');

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>🏢 Workspace Booking System</h1>
          <p>Book meeting rooms efficiently with dynamic pricing</p>
        </div>
      </div>

      <div className="container">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            📋 Rooms
          </button>
          <button
            className={`nav-tab ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            📅 Book Room
          </button>
          <button
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            👨‍💼 Admin Dashboard
          </button>
        </div>

        <div>
          {activeTab === 'rooms' && <RoomsList />}
          {activeTab === 'booking' && <BookingForm />}
          {activeTab === 'admin' && <AdminDashboard />}
        </div>
      </div>
    </div>
  );
}

export default App;

