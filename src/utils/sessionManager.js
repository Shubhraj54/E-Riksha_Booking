// Session Management Utility

export const SESSION_DURATIONS = {
  REMEMBER_ME: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  NORMAL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

// Check if current session is valid
export const isSessionValid = () => {
  try {
    const authUser = localStorage.getItem('authUser');
    const currentSessionExpiry = localStorage.getItem('currentSessionExpiry');
    
    if (!authUser || !currentSessionExpiry) {
      return false;
    }
    
    const expiryDate = new Date(currentSessionExpiry);
    const now = new Date();
    
    return now < expiryDate;
  } catch (error) {
    console.error('Error checking session validity:', error);
    return false;
  }
};

// Check if remembered session is valid
export const isRememberedSessionValid = () => {
  try {
    const rememberedUser = localStorage.getItem('rememberedUser');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (!rememberedUser || !sessionExpiry) {
      return false;
    }
    
    const expiryDate = new Date(sessionExpiry);
    const now = new Date();
    
    return now < expiryDate;
  } catch (error) {
    console.error('Error checking remembered session validity:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    // First try to get from authUser (newer format)
    let authUser = localStorage.getItem('authUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      if (isSessionValid()) {
        return user;
      }
    }
    
    // Fallback to currentUser (older format)
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (isSessionValid()) {
        return user;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get remembered user
export const getRememberedUser = () => {
  try {
    if (!isRememberedSessionValid()) {
      return null;
    }
    
    const rememberedUser = localStorage.getItem('rememberedUser');
    return rememberedUser ? JSON.parse(rememberedUser) : null;
  } catch (error) {
    console.error('Error getting remembered user:', error);
    return null;
  }
};

// Clear all session data
export const clearSession = () => {
  try {
    localStorage.removeItem('authUser');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentSessionExpiry');
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('sessionExpiry');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// Set session expiry
export const setSessionExpiry = (duration = SESSION_DURATIONS.NORMAL) => {
  try {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + duration);
    localStorage.setItem('currentSessionExpiry', expiryDate.toISOString());
  } catch (error) {
    console.error('Error setting session expiry:', error);
  }
};

// Extend current session
export const extendSession = (duration = SESSION_DURATIONS.NORMAL) => {
  try {
    setSessionExpiry(duration);
  } catch (error) {
    console.error('Error extending session:', error);
  }
};

// Check session on app startup
export const checkSessionOnStartup = () => {
  try {
    // Clear invalid sessions
    if (!isSessionValid()) {
      localStorage.removeItem('authUser');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentSessionExpiry');
    }
    
    if (!isRememberedSessionValid()) {
      localStorage.removeItem('rememberedUser');
      localStorage.removeItem('sessionExpiry');
    }
    
    return {
      hasValidSession: isSessionValid(),
      hasRememberedSession: isRememberedSessionValid(),
      currentUser: getCurrentUser(),
      rememberedUser: getRememberedUser()
    };
  } catch (error) {
    console.error('Error checking session on startup:', error);
    return {
      hasValidSession: false,
      hasRememberedSession: false,
      currentUser: null,
      rememberedUser: null
    };
  }
};

// Auto-logout when session expires
export const setupSessionMonitoring = (onSessionExpired) => {
  try {
    // Check session every minute
    const interval = setInterval(() => {
      if (!isSessionValid()) {
        clearSession();
        if (onSessionExpired) {
          onSessionExpired();
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  } catch (error) {
    console.error('Error setting up session monitoring:', error);
  }
};

// Get session info for debugging
export const getSessionInfo = () => {
  try {
    return {
      hasValidSession: isSessionValid(),
      hasRememberedSession: isRememberedSessionValid(),
      currentUser: getCurrentUser(),
      rememberedUser: getRememberedUser(),
      currentSessionExpiry: localStorage.getItem('currentSessionExpiry'),
      sessionExpiry: localStorage.getItem('sessionExpiry'),
      now: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting session info:', error);
    return null;
  }
}; 