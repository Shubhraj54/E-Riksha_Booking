import React from 'react';
import '../CSS/LoadingSkeleton.css';

// Skeleton for rickshaw cards
export const RickshawCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
      <div className="skeleton-button"></div>
    </div>
  </div>
);

// Skeleton for booking form
export const BookingFormSkeleton = () => (
  <div className="skeleton-form">
    <div className="skeleton-form-header">
      <div className="skeleton-image large"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
    </div>
    <div className="skeleton-form-fields">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="skeleton-input"></div>
      ))}
      <div className="skeleton-button large"></div>
    </div>
  </div>
);

// Skeleton for profile page
export const ProfileSkeleton = () => (
  <div className="skeleton-profile">
    <div className="skeleton-profile-header">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-title"></div>
    </div>
    <div className="skeleton-profile-info">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="skeleton-profile-item">
          <div className="skeleton-label"></div>
          <div className="skeleton-value"></div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for dashboard stats
export const StatsSkeleton = () => (
  <div className="skeleton-stats">
    {[1, 2, 3].map(i => (
      <div key={i} className="skeleton-stat-card">
        <div className="skeleton-stat-icon"></div>
        <div className="skeleton-stat-content">
          <div className="skeleton-stat-number"></div>
          <div className="skeleton-stat-label"></div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for table rows
export const TableRowSkeleton = () => (
  <div className="skeleton-table-row">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="skeleton-table-cell"></div>
    ))}
  </div>
);

// Generic skeleton components
export const Skeleton = ({ width, height, className = '' }) => (
  <div 
    className={`skeleton ${className}`}
    style={{ width, height }}
  ></div>
);

export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`skeleton-text-container ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={`skeleton-text ${i === lines - 1 ? 'short' : ''}`}
      ></div>
    ))}
  </div>
);

export const SkeletonButton = ({ className = '' }) => (
  <div className={`skeleton-button ${className}`}></div>
);

export const SkeletonImage = ({ className = '' }) => (
  <div className={`skeleton-image ${className}`}></div>
);

// Main loading skeleton wrapper
const LoadingSkeleton = ({ type = 'default', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'rickshaw-card':
        return <RickshawCardSkeleton />;
      case 'booking-form':
        return <BookingFormSkeleton />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'stats':
        return <StatsSkeleton />;
      case 'table-row':
        return <TableRowSkeleton />;
      default:
        return <Skeleton width="100%" height="20px" />;
    }
  };

  return (
    <div className={`skeleton-wrapper ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton; 