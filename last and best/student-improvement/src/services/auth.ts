import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../../firebase'

export const signUp = async (email: string, password: string, name: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  
  await setDoc(doc(db, 'users', result.user.uid), {
    uid: result.user.uid,
    name,
    email,
    photoUrl: null,
    role: 'user',
    createdAt: serverTimestamp(),
    lastSeenAt: serverTimestamp()
  })
  
  return result.user
}

export const signIn = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  
  await setDoc(doc(db, 'users', result.user.uid), {
    lastSeenAt: serverTimestamp()
  }, { merge: true })
  
  return result.user
}

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  
  await setDoc(doc(db, 'users', result.user.uid), {
    uid: result.user.uid,
    name: result.user.displayName || 'Student',
    email: result.user.email || '',
    photoUrl: result.user.photoURL,
    role: 'user',
    createdAt: serverTimestamp(),
    lastSeenAt: serverTimestamp()
  }, { merge: true })
  
  return result.user
}

export const logout = () => signOut(auth)

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}