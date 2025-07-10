# E-Riksha Rental Services 🛺

A modern, professional E-Riksha rental booking platform built with React, TypeScript, and Redux Toolkit. This application provides a seamless experience for users to browse, book, and manage E-Riksha rentals.

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **Real-time Booking**: Instant booking system with form validation
- **User Authentication**: Secure login/signup with JWT tokens
- **State Management**: Redux Toolkit for global state management
- **Form Validation**: React Hook Form with Yup validation
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Mobile-first approach with modern CSS
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loaders and loading indicators
- **SEO Optimized**: Meta tags and structured data

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/e-riksha-rental-services.git
   cd e-riksha-rental-services
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── store/              # Redux store configuration
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
├── services/           # API services
├── styles/             # Global styles and CSS variables
└── assets/             # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run type-check` - TypeScript type checking

## 🎨 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit, React Redux
- **Routing**: React Router DOM
- **Forms**: React Hook Form, Yup
- **Styling**: CSS Modules, CSS Variables
- **HTTP Client**: Axios
- **Testing**: Vitest, React Testing Library
- **Notifications**: React Hot Toast
- **SEO**: React Helmet Async

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=E-Riksha Rental Services
VITE_APP_VERSION=1.0.0
```

## 📱 Features Overview

### User Features
- Browse available E-Rikshas
- Book rides with date/time selection
- User authentication and profile management
- Booking history and status tracking
- Real-time notifications

### Admin Features
- Dashboard for booking management
- User management
- Analytics and reporting
- System configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@erickshawrent.com or create an issue in this repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Redux team for state management
- All contributors and supporters

---

**Made with ❤️ by the E-Riksha Team**
