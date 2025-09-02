import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../../firebase'
import { Habit } from '../../models'
import { Timestamp } from 'firebase/firestore'

export const subscribeToHabits = (userId: string, callback: (habits: Habit[]) => void) => {
  const q = query(
    collection(db, 'habits'),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (snapshot) => {
    const habits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Habit[]
    
    callback(habits)
  })
}

export const createHabit = async (userId: string, habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
  return await addDoc(collection(db, 'habits'), {
    ...habitData,
    userId,
    streak: 0,
    completedToday: false,
    lastCompleted: null,
    createdAt: serverTimestamp()
  })
}

export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
  return await updateDoc(doc(db, 'habits', habitId), updates)
}

export const deleteHabit = async (habitId: string) => {
  return await deleteDoc(doc(db, 'habits', habitId))
}