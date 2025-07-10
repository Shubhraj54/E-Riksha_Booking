// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Riksha Types
export interface Riksha {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'passenger' | 'cargo' | 'luxury';
  capacity: number;
  features: string[];
  hourlyRate: number;
  dailyRate: number;
  isAvailable: boolean;
  location: string;
  batteryLevel: number;
  lastMaintenance: string;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  rikshaId: string;
  riksha: Riksha;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  durationType: 'hourly' | 'daily';
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  pickupLocation: string;
  dropLocation?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  hours?: string;
  days?: string;
  pickupLocation: string;
  dropLocation?: string;
  specialRequests?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// UI Types
export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Filter and Search Types
export interface RikshaFilters {
  type?: string;
  capacity?: number;
  priceRange?: [number, number];
  location?: string;
  available?: boolean;
}

export interface BookingFilters {
  status?: string;
  dateRange?: [string, string];
  rikshaType?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: 'card' | 'upi' | 'netbanking' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'pickup' | 'drop' | 'both';
}

// App State Types
export interface AppState {
  auth: AuthState;
  rikshas: {
    items: Riksha[];
    selectedRiksha: Riksha | null;
    filters: RikshaFilters;
    loading: LoadingState;
  };
  bookings: {
    items: Booking[];
    currentBooking: Booking | null;
    filters: BookingFilters;
    loading: LoadingState;
  };
  ui: {
    theme: Theme;
    notifications: Notification[];
    sidebarOpen: boolean;
    loading: LoadingState;
  };
} 