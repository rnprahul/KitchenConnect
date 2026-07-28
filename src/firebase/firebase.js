import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1G4o3gTqpouCgRnW2KF0JZtmg_k_p5mI",
  authDomain: "kitchenconnect-eddfd.firebaseapp.com",
  projectId: "kitchenconnect-eddfd",
  storageBucket: "kitchenconnect-eddfd.firebasestorage.app",
  messagingSenderId: "366045967849",
  appId: "1:366045967849:web:fba056d79dcbac0e9e0778",
  measurementId: "G-7LQ1G7BNLJ",
};

const app = initializeApp(firebaseConfig);

// Export Authentication
export const auth = getAuth(app);

// Export Firestore
export const db = getFirestore(app);

// Export Firebase App
export default app;