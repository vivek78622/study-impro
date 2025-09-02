import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../../firebase'
import { Schedule } from '../../models'

export const subscribeToScheduleEvents = (userId: string, callback: (events: Schedule[]) => void) => {
  const q = query(
    collection(db, 'schedule'),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Schedule[]
    
    // Sort client-side until index is created
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    callback(events)
  })
}

export const createScheduleEvent = async (userId: string, eventData: Omit<Schedule, 'id' | 'userId'>) => {
  return await addDoc(collection(db, 'schedule'), {
    ...eventData,
    userId,
    createdAt: serverTimestamp()
  })
}

export const updateScheduleEvent = async (eventId: string, updates: Partial<Schedule>) => {
  if (!eventId) {
    throw new Error('Event ID is required for update')
  }
  return await updateDoc(doc(db, 'schedule', eventId), updates)
}

export const deleteScheduleEvent = async (eventId: string) => {
  if (!eventId) {
    throw new Error('Event ID is required for deletion')
  }
  return await deleteDoc(doc(db, 'schedule', eventId))
}