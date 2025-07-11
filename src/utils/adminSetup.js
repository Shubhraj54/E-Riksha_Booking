// Admin Setup Utility for Immediate Testing
export const setupAdminUser = () => {
  try {
    // Get existing users or create empty array
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if admin user already exists
    const adminExists = existingUsers.find(user => user.email === 'admin@eriksha.com');
    
    if (!adminExists) {
      // Create admin user
      const adminUser = {
        id: 999,
        name: 'Admin User',
        email: 'admin@eriksha.com',
        password: 'admin123',
        role: 'admin',
        isAdmin: true,
        status: 'active',
        joiningDate: '2024-01-01',
        birthdate: '1990-01-01',
        address: 'Admin Address',
        phone: '9876543210',
        gender: 'Male',
        createdAt: new Date('2024-01-01').toISOString()
      };
      
      // Add admin user to existing users
      const allUsers = [...existingUsers, adminUser];
      localStorage.setItem('users', JSON.stringify(allUsers));
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@eriksha.com');
      console.log('🔑 Password: admin123');
      
      return true;
    } else {
      console.log('✅ Admin user already exists!');
      return true;
    }
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    return false;
  }
};

export const checkAdminUser = () => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminUser = users.find(user => user.email === 'admin@eriksha.com');
    
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.email);
      return true;
    } else {
      console.log('❌ Admin user not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
    return false;
  }
};

// Auto-setup admin user when this module is imported
const adminSetupResult = setupAdminUser();
console.log('🔧 Admin setup result:', adminSetupResult);

// Also ensure admin user exists in localStorage
export const ensureAdminUser = () => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminUser = users.find(user => user.email === 'admin@eriksha.com');
    
    if (!adminUser) {
      console.log('🔧 Creating admin user...');
      return setupAdminUser();
    } else {
      console.log('✅ Admin user already exists:', adminUser.email);
      return true;
    }
  } catch (error) {
    console.error('❌ Error ensuring admin user:', error);
    return false;
  }
};

// Call ensureAdminUser on import
ensureAdminUser(); 