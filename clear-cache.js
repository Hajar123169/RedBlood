// Script to clear Metro bundler cache
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths to cache directories
const cacheDirectories = [
  path.join(__dirname, '.expo'),
  path.join(__dirname, 'node_modules', '.cache'),
  path.join(__dirname, 'node_modules', '.expo'),
];

// Function to clear a directory
function clearDirectory(directory) {
  if (fs.existsSync(directory)) {
    console.log(`Clearing cache in ${directory}...`);
    try {
      // Use rmdir with recursive option for Node.js 14+ or use appropriate command for Windows
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${directory}"`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf "${directory}"`, { stdio: 'inherit' });
      }
      console.log(`Successfully cleared cache in ${directory}`);
    } catch (error) {
      console.error(`Error clearing cache in ${directory}: ${error.message}`);
    }
  } else {
    console.log(`Directory ${directory} does not exist, skipping...`);
  }
}

// Clear all cache directories
cacheDirectories.forEach(clearDirectory);

console.log('Cache clearing completed. You can now run "npx expo start" again.');
