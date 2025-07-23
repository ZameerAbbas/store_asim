import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyALP3SyNlZlMGNVjTpqrEA2enAQYA4Ysio",
  authDomain: "chatappdalil.firebaseapp.com",
  databaseURL: "https://chatappdalil-default-rtdb.firebaseio.com/", // Add this line
  projectId: "chatappdalil",
  storageBucket: "chatappdalil.firebasestorage.app",
  messagingSenderId: "787973327102",
  appId: "1:787973327102:web:96da4e81d5b7abcc083daf",
  measurementId: "G-3F1TJVL157"
}

// Initialize Firebase
let app
let database
let storage

try {
  app = initializeApp(firebaseConfig)
  database = getDatabase(app) // Using Realtime Database
  storage = getStorage(app) // Initialize Storage

  console.log("✅ Firebase Realtime Database initialized successfully")
  console.log("✅ Firebase Storage initialized successfully")
  console.log("🔗 Database URL:", firebaseConfig.databaseURL)
  console.log("🗄️ Storage Bucket:", firebaseConfig.storageBucket)
} catch (error) {
  console.error("❌ Firebase initialization failed:", error)
}

// Export both database and storage
export { database, storage }
export default app