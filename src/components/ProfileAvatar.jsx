import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession } from '../utils/sessionManager';
import toast from 'react-hot-toast';
import './ProfileAvatar.css';

const ProfileAvatar = ({ user, onClick, onLogout, className = '' }) => {
  const [imgUrl, setImgUrl] = useState('');
  const [imgError, setImgError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Try to use user's profile image if available
      if (user.profileImage) {
        setImgUrl(user.profileImage);
      } else if (user.name || user.email) {
        // Generate avatar from name/email using DiceBear API
        const seed = encodeURIComponent(user.name || user.email);
        setImgUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=2e7d32&textColor=ffffff`);
      }
    }
  }, [user]);

  const handleImageError = () => {
    setImgError(true);
  };

  const getInitials = () => {
    if (!user) return '?';
    
    if (user.name) {
      return user.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return '?';
  };

  const getDisplayName = () => {
    if (!user) return '';
    
    if (user.name) {
      return user.name.split(' ')[0]; // First name only
    }
    
    if (user.email) {
      return user.email.split('@')[0]; // Username part of email
    }
    
    return 'User';
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      // Fallback to local logout if no handler provided
      clearSession();
      toast.success('Logged out successfully!');
      navigate('/');
    }
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
    if (onClick) onClick();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`profile-avatar-container ${className}`} ref={dropdownRef}>
      <button className="profile-avatar-link" onClick={handleAvatarClick}>
        <div className="profile-avatar">
          {imgUrl && !imgError ? (
            <img 
              src={imgUrl} 
              alt={`${getDisplayName()}'s profile`}
              onError={handleImageError}
              className="profile-avatar-image"
            />
          ) : (
            <div className="profile-avatar-initials">
              {getInitials()}
            </div>
          )}
        </div>
      </button>
      
      {isDropdownOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <span className="profile-dropdown-name">{getDisplayName()}</span>
            <span className="profile-dropdown-email">{user?.email}</span>
          </div>
          <div className="profile-dropdown-links">
            <Link to="/profile" className="profile-dropdown-link" onClick={() => setIsDropdownOpen(false)}>
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </Link>
            <Link to="/profile" className="profile-dropdown-link" onClick={() => setIsDropdownOpen(false)}>
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </Link>
            <button className="profile-dropdown-link logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar; 