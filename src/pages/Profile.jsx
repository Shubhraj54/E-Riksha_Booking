import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../utils/sessionManager';
import { useNotifications } from '../contexts/NotificationContext';
import BookingCalendar from '../components/BookingCalendar';
import PaymentHistory from '../components/PaymentHistory';
import '../CSS/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    gender: '',
    birthdate: '',
    address: '',
  });
  const [bookings, setBookings] = useState([]);
  const [rikshaMap, setRikshaMap] = useState({});
  const [imgUrl, setImgUrl] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'calendar'
  const [selectedBookings, setSelectedBookings] = useState([]);
  const { simulateBookingNotification, simulatePaymentNotification, simulateSystemNotification } = useNotifications();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error('Please login to view your profile');
      return;
    }
    
    setUser(currentUser);
    setForm({
      name: currentUser.name || '',
      phone: currentUser.phone || '',
      gender: currentUser.gender || '',
      birthdate: currentUser.birthdate || '',
      address: currentUser.address || '',
    });
    
    if (currentUser) {
      setImgUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || currentUser.email)}`);
    }
    
    // Load bookings from localStorage
    try {
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      if (currentUser) {
        setBookings(allBookings.filter(b => b.userId === currentUser.id));
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      // Fallback to JSON file
      fetch('/src/data/bookings.json')
        .then(res => res.json())
        .then(data => {
          if (currentUser) {
            setBookings(data.filter(b => b.userId === currentUser.id));
          }
        });
    }
    // Load riksha list
    fetch('/src/data/rikshaList.json')
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(r => { map[r.id] = r; });
        setRikshaMap(map);
      });
  }, []);

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Profile</h2>
        <p>You are not logged in.</p>
      </div>
    );
  }

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      gender: user.gender || '',
      birthdate: user.birthdate || '',
      address: user.address || '',
    });
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update user in localStorage and users.json
      const updatedUser = { ...user, ...form };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update users.json (simulate API)
      let users = [];
      try {
        const res = await fetch('/src/data/users.json');
        users = await res.json();
      } catch {
        users = [updatedUser];
      }
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = updatedUser;
      }
      
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSelect = (bookings) => {
    setSelectedBookings(bookings);
    toast.success(`Found ${bookings.length} booking(s) for selected date`);
  };

  return (
    <div className="profile-container">
      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Booking Calendar
        </button>
        <button 
          className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Payment History
        </button>
      </div>

      {/* Demo Notification Buttons */}
      <div className="demo-notifications">
        <h4>Test Notifications</h4>
        <div className="demo-buttons">
          <button onClick={simulateBookingNotification} className="demo-btn booking">
            Test Booking Notification
          </button>
          <button onClick={simulatePaymentNotification} className="demo-btn payment">
            Test Payment Notification
          </button>
          <button onClick={simulateSystemNotification} className="demo-btn system">
            Test System Notification
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="profile-card profile-flex">
          <div className="profile-main">
            <div className="profile-avatar">
              {imgUrl ? <img src={imgUrl} alt="Profile" /> : <span>{user.name ? user.name[0].toUpperCase() : '?'}</span>}
            </div>
            <h2>{user.name}</h2>
            <div className="profile-info">
              {editMode ? (
                <form onSubmit={handleSave} className="profile-edit-form">
                  <div><strong>Name:</strong> <input name="name" value={form.name} onChange={handleChange} required disabled={isLoading} /></div>
                  <div><strong>Phone:</strong> <input name="phone" value={form.phone} onChange={handleChange} disabled={isLoading} /></div>
                  <div><strong>Gender:</strong> <input name="gender" value={form.gender} onChange={handleChange} disabled={isLoading} /></div>
                  <div><strong>Birthdate:</strong> <input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} disabled={isLoading} /></div>
                  <div><strong>Address:</strong> <input name="address" value={form.address} onChange={handleChange} disabled={isLoading} /></div>
                  <div className="profile-actions">
                    <button className="profile-btn" type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button className="profile-btn" type="button" onClick={handleCancel} style={{marginLeft:8}} disabled={isLoading}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>User ID:</strong> {user.id}</div>
                  <div><strong>Phone:</strong> {user.phone || <span className="profile-missing">Not set</span>}</div>
                  <div><strong>Gender:</strong> {user.gender || <span className="profile-missing">Not set</span>}</div>
                  <div><strong>Birthdate:</strong> {user.birthdate || <span className="profile-missing">Not set</span>}</div>
                  <div><strong>Joining Date:</strong> {user.joiningDate || <span className="profile-missing">Not set</span>}</div>
                  <div><strong>Address:</strong> {user.address || <span className="profile-missing">Not set</span>}</div>
                </>
              )}
            </div>
            {!editMode && (
              <div className="profile-actions">
                <button className="profile-btn" onClick={handleEdit}>Edit Profile</button>
              </div>
            )}
          </div>
          <div className="profile-bookings">
            <h3>Your Bookings</h3>
            {bookings.length === 0 ? (
              <div className="no-bookings">No bookings found.</div>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td>{rikshaMap[b.rikshaId]?.number || 'N/A'}</td>
                      <td>{rikshaMap[b.rikshaId]?.driverName || 'N/A'}</td>
                      <td>{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="calendar-tab">
          <BookingCalendar onBookingSelect={handleBookingSelect} />
          
          {/* Selected Bookings Details */}
          {selectedBookings.length > 0 && (
            <div className="selected-bookings">
              <h3>Bookings for Selected Date</h3>
              <div className="bookings-grid">
                {selectedBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h4>Booking #{booking.id}</h4>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Date:</strong> {booking.date}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      <p><strong>Duration:</strong> {booking.bookingType === 'hourly' ? `${booking.hours} hour(s)` : `${booking.days} day(s)`}</p>
                      <p><strong>Name:</strong> {booking.name}</p>
                      <p><strong>Phone:</strong> {booking.phone}</p>
                      <p><strong>Address:</strong> {booking.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="payments-tab">
          <PaymentHistory />
        </div>
      )}
    </div>
  );
}

export default Profile;
