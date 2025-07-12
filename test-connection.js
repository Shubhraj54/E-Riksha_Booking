const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5174';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'test123456'
};

const testAdmin = {
  name: 'Admin User',
  email: 'admin@eriksha.com',
  password: 'admin123'
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test functions
async function testBackendHealth() {
  try {
    logInfo('Testing backend health...');
    const response = await axios.get(`${BACKEND_URL}/health`);
    if (response.status === 200) {
      logSuccess('Backend is running and healthy');
      return true;
    }
  } catch (error) {
    logError('Backend health check failed');
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testUserRegistration() {
  try {
    logInfo('Testing user registration...');
    const response = await axios.post(`${BACKEND_URL}/auth/signup`, testUser);
    if (response.status === 201) {
      logSuccess('User registration successful');
      return true;
    }
  } catch (error) {
    if (error.response?.status === 409) {
      logWarning('User already exists (this is expected for repeated tests)');
      return true;
    }
    logError('User registration failed');
    logError(`Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testUserLogin() {
  try {
    logInfo('Testing user login...');
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    if (response.status === 200 && response.data.token) {
      logSuccess('User login successful');
      return response.data.token;
    }
  } catch (error) {
    logError('User login failed');
    logError(`Error: ${error.response?.data?.error || error.message}`);
    return null;
  }
}

async function testAdminLogin() {
  try {
    logInfo('Testing admin login...');
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: testAdmin.email,
      password: testAdmin.password
    });
    if (response.status === 200 && response.data.token) {
      logSuccess('Admin login successful');
      return response.data.token;
    }
  } catch (error) {
    logError('Admin login failed');
    logError(`Error: ${error.response?.data?.error || error.message}`);
    return null;
  }
}

async function testProtectedRoutes(token, isAdmin = false) {
  try {
    logInfo(`Testing protected routes with ${isAdmin ? 'admin' : 'user'} token...`);
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test user profile
    const profileResponse = await axios.get(`${BACKEND_URL}/auth/profile`, { headers });
    if (profileResponse.status === 200) {
      logSuccess('Profile access successful');
    }
    
    if (isAdmin) {
      // Test admin routes
      const usersResponse = await axios.get(`${BACKEND_URL}/users`, { headers });
      if (usersResponse.status === 200) {
        logSuccess('Admin users access successful');
      }
    }
    
    return true;
  } catch (error) {
    logError('Protected routes test failed');
    logError(`Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testVehicleAPI(token) {
  try {
    logInfo('Testing vehicle API...');
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test getting vehicles
    const response = await axios.get(`${BACKEND_URL}/vehicles`, { headers });
    if (response.status === 200) {
      logSuccess('Vehicle API access successful');
      return true;
    }
  } catch (error) {
    logError('Vehicle API test failed');
    logError(`Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testBookingAPI(token) {
  try {
    logInfo('Testing booking API...');
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test getting bookings
    const response = await axios.get(`${BACKEND_URL}/bookings`, { headers });
    if (response.status === 200) {
      logSuccess('Booking API access successful');
      return true;
    }
  } catch (error) {
    logError('Booking API test failed');
    logError(`Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testPaymentAPI(token) {
  try {
    logInfo('Testing payment API...');
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test getting payments
    const response = await axios.get(`${BACKEND_URL}/payments`, { headers });
    if (response.status === 200) {
      logSuccess('Payment API access successful');
      return true;
    }
  } catch (error) {
    logError('Payment API test failed');
    logError(`Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testDriverAPI(token) {
  try {
    logInfo('Testing driver API...');
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test getting drivers
    const response = await axios.get(`${BACKEND_URL}/drivers`, { headers });
    if (response.status === 200) {
      logSuccess('Driver API access successful');
      return true;
    }
  } catch (error) {
    logError('Driver API test failed');
    logError(`Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Main test function
async function runAllTests() {
  log('🚀 Starting E-Riksha API Connection Tests', 'bold');
  log('==========================================', 'bold');
  
  // Test 1: Backend Health
  const backendHealthy = await testBackendHealth();
  if (!backendHealthy) {
    logError('Backend is not available. Please start the backend server first.');
    logInfo('Run: cd backend && npm start');
    return;
  }
  
  // Test 2: User Registration
  await testUserRegistration();
  
  // Test 3: User Login
  const userToken = await testUserLogin();
  if (!userToken) {
    logError('Cannot proceed with user tests without valid token');
    return;
  }
  
  // Test 4: Admin Login
  const adminToken = await testAdminLogin();
  if (!adminToken) {
    logWarning('Admin login failed - this might be expected if admin user is not set up');
  }
  
  // Test 5: Protected Routes (User)
  await testProtectedRoutes(userToken, false);
  
  // Test 6: Protected Routes (Admin)
  if (adminToken) {
    await testProtectedRoutes(adminToken, true);
  }
  
  // Test 7: Vehicle API
  await testVehicleAPI(userToken);
  
  // Test 8: Booking API
  await testBookingAPI(userToken);
  
  // Test 9: Payment API
  await testPaymentAPI(userToken);
  
  // Test 10: Driver API
  await testDriverAPI(userToken);
  
  log('', 'bold');
  log('🎉 API Connection Tests Completed!', 'bold');
  log('==========================================', 'bold');
  logInfo('If all tests passed, your backend is working correctly.');
  logInfo('You can now use the frontend with backend integration.');
  logInfo('');
  logInfo('Frontend URL: ' + FRONTEND_URL);
  logInfo('Backend URL: ' + BACKEND_URL);
  logInfo('');
  logInfo('Test Credentials:');
  logInfo(`User: ${testUser.email} / ${testUser.password}`);
  logInfo(`Admin: ${testAdmin.email} / ${testAdmin.password}`);
}

// Run tests
runAllTests().catch(error => {
  logError('Test suite failed with error:');
  logError(error.message);
  process.exit(1);
}); 