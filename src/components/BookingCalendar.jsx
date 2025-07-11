import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { getCurrentUser } from '../utils/sessionManager';
import toast from 'react-hot-toast';
import '../CSS/BookingCalendar.css';

const BookingCalendar = ({ onBookingSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        toast.error('Please login to view your bookings');
        return;
      }

      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const userBookings = allBookings.filter(b => b.userId === user.id);
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return isSameDay(bookingDate, date);
    });
  };

  const getFilteredBookings = () => {
    if (filterStatus === 'all') {
      return bookings;
    }
    return bookings.filter(booking => booking.status === filterStatus);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dayBookings = getBookingsForDate(date);
    if (dayBookings.length > 0) {
      onBookingSelect?.(dayBookings);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#2e7d32';
      case 'pending':
        return '#f57c00';
      case 'cancelled':
        return '#d32f2f';
      case 'completed':
        return '#1976d2';
      default:
        return '#666';
    }
  };

  const renderCalendarGrid = () => {
    const days = getCalendarDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="calendar-grid">
        {/* Week day headers */}
        <div className="calendar-header">
          {weekDays.map(day => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="calendar-body">
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const dayBookings = getBookingsForDate(day);

            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="day-number">{format(day, 'd')}</div>
                {dayBookings.length > 0 && (
                  <div className="booking-indicators">
                    {dayBookings.slice(0, 3).map((booking, idx) => (
                      <div
                        key={idx}
                        className="booking-dot"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                        title={`${booking.bookingType === 'hourly' ? `${booking.hours} hours` : `${booking.days} days`} - ${booking.status}`}
                      />
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="booking-more">+{dayBookings.length - 3}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBookingList = () => {
    const filteredBookings = getFilteredBookings();
    const sortedBookings = filteredBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <div className="booking-list">
        {sortedBookings.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings found for the selected filter.</p>
          </div>
        ) : (
          sortedBookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <div className="booking-date">
                <div className="date-number">{format(new Date(booking.date), 'd')}</div>
                <div className="date-month">{format(new Date(booking.date), 'MMM')}</div>
              </div>
              <div className="booking-details">
                <h4>Booking #{booking.id}</h4>
                <p>Time: {booking.time}</p>
                <p>Duration: {booking.bookingType === 'hourly' ? `${booking.hours} hour(s)` : `${booking.days} day(s)`}</p>
                <p>Name: {booking.name}</p>
              </div>
              <div className="booking-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(booking.status) }}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="booking-calendar">
      {/* Calendar Header */}
      <div className="calendar-controls">
        <div className="calendar-navigation">
          <button onClick={handlePrevMonth} className="nav-btn">‹</button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={handleNextMonth} className="nav-btn">›</button>
        </div>
        
        <div className="calendar-actions">
          <button onClick={handleToday} className="today-btn">Today</button>
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Calendar Content */}
      <div className="calendar-content">
        {viewMode === 'month' ? renderCalendarGrid() : renderBookingList()}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#2e7d32' }}></div>
          <span>Confirmed</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#f57c00' }}></div>
          <span>Pending</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#d32f2f' }}></div>
          <span>Cancelled</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#1976d2' }}></div>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar; 