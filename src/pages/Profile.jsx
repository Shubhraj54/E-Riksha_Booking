import React, { useEffect, useState } from 'react';
import '../CSS/Profile.css';

function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('authUser')));
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    birthdate: user?.birthdate || '',
    address: user?.address || '',
  });
  const [bookings, setBookings] = useState([]);
  const [rikshaMap, setRikshaMap] = useState({});
  const [imgUrl, setImgUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setImgUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email)}`);
    }
    // Load bookings
    fetch('/src/data/bookings.json')
      .then(res => res.json())
      .then(data => {
        if (user) {
          setBookings(data.filter(b => b.userId === user.id));
        }
      });
    // Load riksha list
    fetch('/src/data/rikshaList.json')
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(r => { map[r.id] = r; });
        setRikshaMap(map);
      });
  }, [user]);

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
    setMessage('');
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
    setMessage('');
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
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
    // This would be a POST/PUT in a real app, but we can't write to file from frontend
    // So just update localStorage for now
    setMessage('Profile updated!');
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card profile-flex">
          <div className="profile-main">
            <div className="profile-avatar">
              {imgUrl ? <img src={imgUrl} alt="Profile" /> : <span>{user.name ? user.name[0].toUpperCase() : '?'}</span>}
            </div>
            <h2>{user.name}</h2>
            <div className="profile-info">
              {editMode ? (
                <form onSubmit={handleSave} className="profile-edit-form">
                  <div><strong>Name:</strong> <input name="name" value={form.name} onChange={handleChange} required /></div>
                  <div><strong>Phone:</strong> <input name="phone" value={form.phone} onChange={handleChange} /></div>
                  <div><strong>Gender:</strong> <input name="gender" value={form.gender} onChange={handleChange} /></div>
                  <div><strong>Birthdate:</strong> <input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} /></div>
                  <div><strong>Address:</strong> <input name="address" value={form.address} onChange={handleChange} /></div>
                  <div className="profile-actions">
                    <button className="profile-btn" type="submit">Save</button>
                    <button className="profile-btn" type="button" onClick={handleCancel} style={{marginLeft:8}}>Cancel</button>
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
            {message && <div className="auth-success" style={{marginTop:8}}>{message}</div>}
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
    </div>
  );
}

export default Profile;
