# Brand Configuration System

## Overview
The RideX application uses a centralized brand configuration system that allows you to easily change the brand name and related information across the entire application.

## Files Structure
```
src/Ride/
├── config/
│   └── brandConfig.js          # Main brand configuration
├── utils/
│   └── brandUtils.js           # Utility functions
└── README_BRAND_CONFIG.md      # This documentation
```

## How to Change Brand Name

### Method 1: Direct Configuration (Recommended)
Edit `src/Ride/config/brandConfig.js`:

```javascript
export const brandConfig = {
  name: 'YourBrandName',           // Change this
  fullName: 'YourBrandName - India\'s #1 Bike Taxi Service',  // Change this
  // ... other configurations
};
```

### Method 2: Using Utility Functions
You can also use the utility functions in `src/Ride/utils/brandUtils.js`:

```javascript
import { getBrandName, updateBrandName } from '../utils/brandUtils';

// Get current brand name
const currentName = getBrandName();

// Update brand name (future functionality)
updateBrandName('NewBrandName');
```

## What Gets Updated Automatically

When you change the brand name in `brandConfig.js`, the following will be updated across the entire application:

### 1. **Brand Names**
- All instances of "RideX" → Your new brand name
- App titles and headers
- Logo text
- Page titles

### 2. **Contact Information**
- Email addresses (support@ridex.com → support@yourbrand.com)
- Phone numbers
- Address information

### 3. **Social Media Links**
- Facebook, Twitter, Instagram, YouTube, LinkedIn URLs

### 4. **App Information**
- App name in download sections
- App descriptions
- Feature lists

### 5. **Company Information**
- Founded year
- Number of cities
- User count
- Ratings

### 6. **Copyright Information**
- Automatically updates with current year
- Uses your brand name

## Configuration Options

### Basic Brand Info
```javascript
name: 'YourBrand',                    // Short brand name
fullName: 'YourBrand - Tagline',      // Full brand name with tagline
tagline: 'Your tagline here'          // Brand tagline
```

### Contact Information
```javascript
email: {
  support: 'support@yourbrand.com',
  business: 'business@yourbrand.com'
},
phone: '+91 1800-123-4567',
address: 'YourBrand Headquarters, City, State, Country'
```

### Social Media
```javascript
social: {
  facebook: 'https://facebook.com/yourbrand',
  twitter: 'https://twitter.com/yourbrand',
  instagram: 'https://instagram.com/yourbrand',
  youtube: 'https://youtube.com/yourbrand',
  linkedin: 'https://linkedin.com/company/yourbrand'
}
```

### App Information
```javascript
app: {
  name: 'YourBrand',
  description: 'Your app description here',
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}
```

### Company Information
```javascript
company: {
  founded: '2015',
  cities: '100+',
  users: '10M+',
  rating: '4.5★'
}
```

## Components That Use Brand Config

The following components automatically use the brand configuration:

1. **RideAboutSection** - About page content
2. **RideServicesSection** - Services page content
3. **RideHeroSection** - Hero section with app preview
4. **RideDownloadSection** - Download app section
5. **RideContactSection** - Contact information
6. **RideFooter** - Footer with contact and copyright
7. **Layout** - Page metadata (title, description)

## Benefits

1. **Single Source of Truth** - All brand information in one place
2. **Easy Updates** - Change brand name in one file
3. **Consistency** - Ensures all components use the same information
4. **Maintainability** - Easy to maintain and update
5. **Scalability** - Easy to add new brand-related information

## Future Enhancements

The system is designed to be extensible. You can easily add:
- Multiple language support
- Theme configurations
- Dynamic brand switching
- API-based brand configuration
- Admin panel for brand management

## Example: Changing to "BikeGo"

To change the brand from "RideX" to "BikeGo":

1. Edit `src/Ride/config/brandConfig.js`
2. Change `name: 'RideX'` to `name: 'BikeGo'`
3. Update email domains: `support@ridex.com` → `support@bikego.com`
4. Update social media URLs
5. Save the file

All components will automatically update to use "BikeGo" instead of "RideX". 