import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '../../firebase'
import { ScheduleEvent, CreateScheduleEvent } from '../../models/schedule'

export const subscribeToMonthEvents = (
  userId: string, 
  startOfMonth: Date, 
  endOfMonth: Date,
  callback: (events: ScheduleEvent[]) => void
) => {
  const q = query(
    collection(db, 'schedule'),
    where('userId', '==', userId),
    where('date', '>=', Timestamp.fromDate(startOfMonth)),
    where('date', '<=', Timestamp.fromDate(endOfMonth))
  )
  
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ScheduleEvent[]
    
    callback(events)
  })
}

export const createScheduleEvent = async (userId: string, eventData: CreateScheduleEvent) => {
  return await addDoc(collection(db, 'schedule'), {
    ...eventData,
    userId,
    date: Timestamp.fromDate(eventData.date),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export const updateScheduleEvent = async (eventId: string, updates: Partial<ScheduleEvent>) => {
  return await updateDoc(doc(db, 'schedule', eventId), {
    ...updates,
    updatedAt: serverTimestamp()
  })
}

export const deleteScheduleEvent = async (eventId: string) => {
  return await deleteDoc(doc(db, 'schedule', eventId))
}