# RedBlood Mobile App - Setup Guide

This guide provides instructions for setting up and running the RedBlood mobile app project.

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- **Node.js** (v14.0.0 or later)
- **npm** (v6.0.0 or later) or **yarn** (v1.22.0 or later)
- **Expo CLI** (install globally with `npm install -g expo-cli`)
- **Git** for version control

For mobile development and testing:
- iOS development: macOS with Xcode (for iOS simulator)
- Android development: Android Studio with Android SDK (for Android emulator)
- Alternatively, you can use your physical device with the Expo Go app

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd RedBlood
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or if you're using yarn:
   ```
   yarn install
   ```

## Required Dependencies

The RedBlood app requires the following dependencies, which will be installed when you run `npm install` or `yarn install`:

### Core Dependencies
- react
- react-native
- expo

### Navigation
- @react-navigation/native
- @react-navigation/stack
- @react-navigation/bottom-tabs
- react-native-screens
- react-native-safe-area-context

### UI Components
- @expo/vector-icons
- react-native-paper (Material Design components)
- react-native-vector-icons
- react-native-gesture-handler

### Data Management
- @react-native-async-storage/async-storage
- axios

### Maps and Location
- expo-location
- react-native-maps

### Notifications
- expo-notifications
- expo-device
- expo-constants

### Media and Camera
- expo-image-picker
- expo-camera
- expo-media-library

### Forms and Validation
- react-hook-form
- yup

### Utilities
- date-fns (date manipulation)
- lodash (utility functions)

### Development Dependencies
- @babel/core
- @types/react (if using TypeScript)
- @types/react-native (if using TypeScript)
- jest-expo (for testing)
- eslint
- prettier

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:
   ```
   API_URL=https://your-api-url.com/api
   EXPO_PROJECT_ID=your-expo-project-id
   ```

2. Update the `app.json` file with your specific configuration:
   ```json
   {
     "expo": {
       "name": "RedBlood",
       "slug": "redblood",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/images/icon.png",
       "splash": {
         "image": "./assets/images/splash-icon.png",
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       },
       "updates": {
         "fallbackToCacheTimeout": 0
       },
       "assetBundlePatterns": [
         "**/*"
       ],
       "ios": {
         "supportsTablet": true
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/images/adaptive-icon.png",
           "backgroundColor": "#FFFFFF"
         },
         "permissions": [
           "ACCESS_FINE_LOCATION",
           "ACCESS_COARSE_LOCATION",
           "CAMERA",
           "READ_EXTERNAL_STORAGE",
           "WRITE_EXTERNAL_STORAGE"
         ]
       },
       "web": {
         "favicon": "./assets/images/favicon.png"
       },
       "plugins": [
         "expo-location",
         "expo-camera",
         "expo-notifications"
       ]
     }
   }
   ```

## Running the App

1. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```
   or
   ```
   expo start
   ```

2. Run on specific platforms:
   - For iOS:
     ```
     npm run ios
     ```
   - For Android:
     ```
     npm run android
     ```
   - For web:
     ```
     npm run web
     ```

3. Using Expo Go on your physical device:
   - Install the Expo Go app from the App Store (iOS) or Google Play Store (Android)
   - Scan the QR code displayed in your terminal or browser

## Troubleshooting

### Common Issues

1. **Metro bundler fails to start**
   - Clear the cache: `expo start -c`
   - Delete the `node_modules` folder and reinstall dependencies

2. **Dependency conflicts**
   - We've already fixed a known dependency conflict between react-native 0.79.2 and @react-native-async-storage/async-storage by updating to a compatible version
   - If you still encounter dependency issues, try installing with `npm install --force` or `npm install --legacy-peer-deps`
   - Run `npm dedupe` or `yarn dedupe` to remove duplicate dependencies
   - Check for compatibility issues between packages
   - For more details about dependency fixes, see the DEPENDENCY-FIX.md file

3. **Package version compatibility warnings**
   - We've updated all package versions to be compatible with Expo SDK 53.0.9 as recommended by Expo
   - This should prevent warnings when starting the application with `npx expo start`
   - If you still see compatibility warnings, check PACKAGE-UPDATE.md for details on the updates made
   - You may need to run `npm install` or `yarn install` to apply the changes

4. **Expo SDK version mismatch**
   - Ensure all Expo packages are using compatible versions
   - Update Expo SDK: `expo update`

5. **iOS/Android specific issues**
   - For iOS: Check Xcode version and iOS simulator compatibility
   - For Android: Ensure Android SDK is properly configured

## Additional Configuration

### Firebase Setup (if used)

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add iOS and Android apps to your Firebase project
3. Download the configuration files:
   - For iOS: `GoogleService-Info.plist`
   - For Android: `google-services.json`
4. Place these files in the appropriate directories according to the Expo Firebase documentation

### Backend API

Ensure your backend API is running and accessible. Update the API URL in your `.env` file or in `src/api/axios.js`.

## Development Workflow

1. Create a new branch for each feature or bug fix
2. Write clean, maintainable code following the project's coding standards
3. Test your changes thoroughly on multiple devices/platforms
4. Submit a pull request for review

## Building for Production

1. Configure app.json with your production settings
2. Build the app:
   ```
   expo build:android
   expo build:ios
   ```
3. Follow the prompts to complete the build process

## Support

If you encounter any issues or have questions, please refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- Project maintainers and contributors
