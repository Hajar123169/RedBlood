# RedBlood Mobile App - Project Documentation

## Overview

RedBlood is a mobile application designed to connect blood donors with those in need of blood donations. The app facilitates the blood donation process by allowing users to find donation centers, schedule appointments, and respond to blood requests from people in need.

This document provides a comprehensive guide to the project structure, explaining the purpose and functionality of each directory and key files.

## Project Structure

### Frontend (React Native + Expo)

```
/RedBlood
├── /assets                    # Static assets like images, fonts, etc.
│   ├── /images                # App images, icons, splash screens
│   ├── /fonts                 # Custom fonts
│   └── /animations            # Lottie animations
├── /src                       # Main source code directory
│   ├── /api                   # API service layer
│   ├── /components            # Reusable UI components
│   ├── /contexts              # React Context API
│   ├── /hooks                 # Custom React hooks
│   ├── /navigation            # Navigation configuration
│   ├── /screens               # App screens
│   ├── /services              # Business logic services
│   ├── /theme                 # App styling
│   ├── /utils                 # Utility functions
│   └── App.js                 # Entry point for the React Native app
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── package.json               # NPM dependencies and scripts
└── README.md                  # Project documentation
```

## Detailed Directory and File Descriptions

### Assets

The `assets` directory contains all static assets used in the application:

- **images**: Contains app icons, splash screens, and other image assets
- **fonts**: Contains custom font files used in the app
- **animations**: Contains Lottie animation files for enhanced UI experiences

### Source Code (src)

#### API Layer (`/src/api`)

The API layer handles all communication with the backend services:

- **axios.js**: Configures the Axios HTTP client with interceptors for authentication and error handling
- **authAPI.js**: Handles authentication-related API calls (login, register, password reset)
- **userAPI.js**: Manages user-related API calls (profile management, settings)
- **donationAPI.js**: Handles donation-related API calls (centers, appointments, eligibility)
- **requestAPI.js**: Manages blood request API calls (create, update, respond to requests)

#### Components (`/src/components`)

Reusable UI components organized by feature:

- **common**: Shared components used across the app
  - Buttons, inputs, cards, loaders, etc.
- **auth**: Authentication-related components
  - Login forms, registration forms, etc.
- **donation**: Donation-related components
  - Donation center cards, appointment forms, etc.
- **profile**: Profile-related components
  - Profile information displays, edit forms, etc.
- **request**: Blood request components
  - Request cards, request forms, etc.

#### Contexts (`/src/contexts`)

React Context providers for state management:

- **AuthContext.js**: Manages authentication state (user data, login/logout functions)
- **ThemeContext.js**: Manages app theme (light/dark mode, theme preferences)

#### Hooks (`/src/hooks`)

Custom React hooks for reusable logic:

- **useAuth.js**: Hook for accessing authentication context and functions
- **useLocation.js**: Hook for accessing and managing device location
- **useNotification.js**: Hook for managing push notifications

#### Navigation (`/src/navigation`)

Navigation configuration using React Navigation:

- **AppNavigator.js**: Main navigation container that handles auth state
- **AuthNavigator.js**: Navigation stack for authentication screens
- **TabNavigator.js**: Bottom tab navigation for the main app screens

#### Screens (`/src/screens`)

App screens organized by feature:

- **auth**: Authentication screens
  - Login, Register, ForgotPassword, etc.
- **donation**: Donation-related screens
  - DonationCenters, ScheduleDonation, DonationHistory, etc.
- **profile**: User profile screens
  - Profile, EditProfile, Settings, etc.
- **request**: Blood request screens
  - CreateRequest, RequestDetails, NearbyRequests, etc.
- **admin**: Admin dashboard screens (for authorized users)

#### Services (`/src/services`)

Business logic services:

- **authService.js**: Authentication logic and token management
- **locationService.js**: Location services for finding nearby centers/requests
- **storageService.js**: Local storage operations for persisting data
- **notificationService.js**: Push notification handling and management

#### Theme (`/src/theme`)

App styling and theming:

- **colors.js**: Color palette definitions for light and dark themes
- **spacing.js**: Spacing constants for consistent layout
- **typography.js**: Typography styles and font definitions
- **index.js**: Exports theme objects and individual theme components

#### Utils (`/src/utils`)

Utility functions:

- **validators.js**: Form validation functions
- **formatters.js**: Data formatting utilities (dates, phone numbers, etc.)
- **permissions.js**: Device permission handling
- **constants.js**: App-wide constants (API endpoints, error messages, etc.)

#### App Entry Point

- **App.js**: Main entry point that sets up providers and renders the app

## Key Files in Detail

### API Layer

#### axios.js
```javascript
// Configures Axios with base URL, timeout, headers
// Sets up request interceptors for adding auth tokens
// Sets up response interceptors for handling errors
```

#### authAPI.js
```javascript
// Provides functions for:
// - User login
// - User registration
// - Password reset
// - Email verification
// - Logout
```

### Contexts

#### AuthContext.js
```javascript
// Provides authentication state and functions:
// - Current user data
// - Login/logout functions
// - Registration function
// - Password reset functions
// - Loading and error states
```

#### ThemeContext.js
```javascript
// Provides theme state and functions:
// - Current theme (light/dark)
// - Theme switching function
// - Theme preference persistence
```

### Navigation

#### AppNavigator.js
```javascript
// Main navigation container
// Conditionally renders auth or main app flow based on auth state
// Applies theme to navigation container
```

### Theme

#### colors.js
```javascript
// Defines color palettes for light and dark themes
// Includes primary, secondary, and semantic colors
```

#### typography.js
```javascript
// Defines typography styles for different text elements
// Includes font families, sizes, weights, and variants
```

### Utils

#### validators.js
```javascript
// Form validation functions for:
// - Email validation
// - Password validation
// - Phone number validation
// - Name validation
// - Blood type validation
```

#### constants.js
```javascript
// App-wide constants including:
// - API endpoints
// - Storage keys
// - Blood types and compatibility
// - Error messages
// - Success messages
// - App routes
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```
4. Follow the instructions in the terminal to open the app on your device or simulator

## Development Workflow

1. **Authentication Flow**: Users can register, login, and manage their accounts
2. **Donation Flow**: Users can find donation centers, check eligibility, and schedule appointments
3. **Request Flow**: Users can create blood requests, view nearby requests, and respond to requests
4. **Profile Management**: Users can view and edit their profiles, manage settings

## Key Features

- User authentication and profile management
- Blood donation center locator with maps integration
- Donation appointment scheduling
- Blood request creation and management
- Push notifications for donation reminders and blood requests
- Blood type compatibility checking
- Donation history tracking

## Dependencies

The app uses several key dependencies:

- **React Navigation**: For app navigation
- **Axios**: For API calls
- **Expo Location**: For location services
- **Expo Notifications**: For push notifications
- **AsyncStorage**: For local data persistence
- **React Native Maps**: For maps integration

## Conclusion

This documentation provides a comprehensive overview of the RedBlood mobile app project structure. Each directory and key file has been explained to help developers understand the organization and functionality of the codebase.

For more detailed information about specific components or implementation details, refer to the inline documentation within each file.