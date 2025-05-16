# RedBlood App - Asset Path Fix

## Issue Description

When running `npx expo start` and scanning the QR code with a mobile device, the app displayed a blank page. The console showed the following error:

```
Unable to resolve asset "./assets/icon.png" from "icon" in your app.json or app.config.js
```

This error occurred because the app.json file was looking for image assets directly in the `assets` directory, but the image files had been moved to the `assets/images` subdirectory.

## Problem Analysis

The app.json file contained references to image assets with paths like:
- `./assets/icon.png`
- `./assets/splash-icon.png`
- `./assets/adaptive-icon.png`
- `./assets/favicon.png`

However, the actual file structure had these images located in the `assets/images` directory:
- `./assets/images/icon.png`
- `./assets/images/splash-icon.png`
- `./assets/images/adaptive-icon.png`
- `./assets/images/favicon.png`

This mismatch in paths prevented Expo from finding the necessary image assets, resulting in the blank screen when running the app.

## Solution Applied

The app.json file has been updated to point to the correct paths for all image assets:

```diff
- "icon": "./assets/icon.png",
+ "icon": "./assets/images/icon.png",

- "image": "./assets/splash-icon.png",
+ "image": "./assets/images/splash-icon.png",

- "foregroundImage": "./assets/adaptive-icon.png",
+ "foregroundImage": "./assets/images/adaptive-icon.png",

- "favicon": "./assets/favicon.png"
+ "favicon": "./assets/images/favicon.png"
```

## Why This Works

The updated paths in app.json now correctly match the actual location of the image files in the project's directory structure. This allows Expo to properly locate and load the image assets when the app is running.

## How to Verify the Fix

To verify that the fix works:

1. Run `npx expo start` in the project directory
2. Scan the QR code with your mobile device using the Expo Go app
3. The app should now load properly without showing a blank screen

## Best Practices for Asset Management

To avoid similar issues in the future:

1. **Consistent Directory Structure**: Maintain a consistent directory structure for assets and update configuration files when the structure changes.

2. **Asset Organization**: Organizing assets in subdirectories (like images, fonts, animations) is good practice, but make sure all configuration files are updated accordingly.

3. **Testing After Restructuring**: Always test the app after restructuring directories or moving files to ensure all paths are correctly updated.

4. **Documentation**: Document your asset organization strategy to help team members understand where assets should be placed.