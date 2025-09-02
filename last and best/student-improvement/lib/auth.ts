import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'
import { initializeFirestore, seedUserData } from '../seed'

export const signUp = async (email: string, password: string, name: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  
  // Create user document
  await setDoc(doc(db, 'users', result.user.uid), {
    uid: result.user.uid,
    name,
    email,
    photoUrl: null,
    role: 'user' as const,
    createdAt: serverTimestamp(),
    lastSeenAt: serverTimestamp()
  })
  
  // Seed sample data for new user
  await seedUserData(result.user.uid)
  
  return result.user
}

export const signIn = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  
  // Update lastSeenAt
  await setDoc(doc(db, 'users', result.user.uid), {
    lastSeenAt: serverTimestamp()
  }, { merge: true })
  
  return result.user
}

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  
  // Check if user document exists
  const userDoc = await getDoc(doc(db, 'users', result.user.uid))
  
  if (!userDoc.exists()) {
    // Create new user document
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      name: result.user.displayName || 'Student',
      email: result.user.email || '',
      photoUrl: result.user.photoURL,
      role: 'user' as const,
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp()
    })
    
    // Seed sample data for new user
    await seedUserData(result.user.uid)
  } else {
    // Update lastSeenAt for existing user
    await setDoc(doc(db, 'users', result.user.uid), {
      lastSeenAt: serverTimestamp()
    }, { merge: true })
  }
  
  return result.user
}

export const logout = () => signOut(auth)

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Initialize Firestore on app start
initializeFirestore()