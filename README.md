# RedBlood - Blood Donation App

RedBlood is a mobile application that connects blood donors with those in need. This app is built using React Native with Expo.

## Features

- **User Authentication**: Static authentication with hardcoded credentials
- **Home Screen**: Welcome message, donation options, and blood donation statistics
- **Search Screen**: Search for donors by blood type with map view
- **Donations Screen**: View donation history and schedule new donations
- **Profile Screen**: User information, blood type compatibility, and settings

## Project Structure

The project follows a modular structure:

```
RedBlood/
├── assets/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── api/                # API services
│   ├── components/         # Reusable UI components
│   ├── constants/          # App constants
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # App screens
│   ├── services/           # Service functions
│   └── utils/              # Utility functions
├── App.js                  # Entry point
└── package.json            # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

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

### Running the App

1. Start the development server:
   ```
   npx expo start
   ```
2. Scan the QR code with the Expo Go app on your mobile device or use an emulator

## Authentication

For testing purposes, the app uses static authentication with the following credentials:

- **Email**: user@redblood.com
- **Password**: Blood123!

## Screens

### Home Screen
- Welcome message with user name
- "Donate Blood" button
- View nearby blood requests
- Recent donation history

### Search Screen
- Search for donors by blood type
- Toggle between list and map views
- Create blood request

### Donations Screen
- View donation history
- View blood requests
- Schedule new donations

### Profile Screen
- User information
- Blood type compatibility information
- Account settings
- Logout functionality

## Implementation Details

### Authentication
- Static authentication using hardcoded credentials
- Form validation for empty fields
- Error handling for invalid credentials

### Navigation
- Bottom tab navigation for authenticated users
- Stack navigation for authentication flow
- Protected routes based on authentication state

### State Management
- React Context API for authentication state
- Local state for screen-specific data

## Troubleshooting

If you encounter cache-related errors when starting the app, you can clear the Metro bundler cache:

1. Run the clear-cache script:
   ```
   node clear-cache.js
   ```
   or on Windows:
   ```
   .\clear-cache.bat
   ```

2. Restart the app:
   ```
   npx expo start
   ```

## Future Enhancements

- Backend integration with Firebase
- Real-time notifications for blood requests
- User registration and profile management
- Blood donation appointment scheduling
- Blood bank integration