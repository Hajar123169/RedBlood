/**
 * Environment variables configuration
 */

// Define and validate required environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USERNAME',
  'EMAIL_PASSWORD',
  'EMAIL_FROM',
];

// Check for missing environment variables in production
if (process.env.NODE_ENV === 'production') {
  const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);
  if (missingEnvVars.length) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

// Export environment variables with defaults for development
module.exports = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Firebase configuration
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? 
      process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@redblood.com',
  },
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
};