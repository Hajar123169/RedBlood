// Firebase configuration
import { initializeApp, getApps, getApp } from "firebase/app";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDFrPGBYQRcz7Uu9lOGLRJOu5V9UL3fG-E",
  authDomain: "redblood-app.firebaseapp.com",
  projectId: "redblood-app",
  storageBucket: "redblood-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl",
  measurementId: "G-HM11X0LM7N"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export default app;