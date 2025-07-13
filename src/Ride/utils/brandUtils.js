import { brandConfig } from '../config/brandConfig';

// Utility functions for brand operations
export const getBrandName = () => brandConfig.name;
export const getBrandFullName = () => brandConfig.fullName;
export const getBrandTagline = () => brandConfig.tagline;

// Contact utilities
export const getSupportEmail = () => brandConfig.email.support;
export const getBusinessEmail = () => brandConfig.email.business;
export const getPhoneNumber = () => brandConfig.phone;
export const getAddress = () => brandConfig.address;

// App utilities
export const getAppName = () => brandConfig.app.name;
export const getAppDescription = () => brandConfig.app.description;
export const getAppFeatures = () => brandConfig.app.features;

// Company utilities
export const getCompanyInfo = () => brandConfig.company;
export const getCopyright = () => brandConfig.copyright;

// Social media utilities
export const getSocialLinks = () => brandConfig.social;

// Function to update brand name (for future use)
export const updateBrandName = (newName) => {
  // This could be used to dynamically update brand name
  // For now, it's just a placeholder for future functionality
  console.log(`Brand name would be updated to: ${newName}`);
  return newName;
};

export default {
  getBrandName,
  getBrandFullName,
  getBrandTagline,
  getSupportEmail,
  getBusinessEmail,
  getPhoneNumber,
  getAddress,
  getAppName,
  getAppDescription,
  getAppFeatures,
  getCompanyInfo,
  getCopyright,
  getSocialLinks,
  updateBrandName
}; 