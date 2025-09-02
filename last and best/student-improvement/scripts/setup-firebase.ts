import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBgEtokDofzL7djs-BmYmME1Zm63SAUrL4",
  authDomain: "study-improve.firebaseapp.com",
  projectId: "study-improve",
  storageBucket: "study-improve.firebasestorage.app",
  messagingSenderId: "438305463142",
  appId: "1:438305463142:web:9608f439bb9f021bc946a7"
}

async function setupFirebase() {
  try {
    console.log('🔥 Initializing Firebase...')
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    
    console.log('✅ Firebase initialized successfully!')
    console.log('Project ID:', firebaseConfig.projectId)
    console.log('Auth Domain:', firebaseConfig.authDomain)
    
    // Test connection
    console.log('🔍 Testing Firebase connection...')
    console.log('Auth instance:', !!auth)
    console.log('Firestore instance:', !!db)
    
    console.log('\n📋 Next steps:')
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/project/study-improve')
    console.log('2. Enable Authentication > Email/Password provider')
    console.log('3. Set up Firestore Database')
    console.log('4. Restart your dev server')
    
  } catch (error) {
    console.error('❌ Firebase setup failed:', error)
  }
}

setupFirebase()