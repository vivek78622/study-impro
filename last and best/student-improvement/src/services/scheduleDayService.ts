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

export const subscribeToScheduleByDate = (
  userId: string, 
  date: Date, 
  callback: (events: ScheduleEvent[]) => void
) => {
  const startOfSelectedDay = new Date(date)
  startOfSelectedDay.setHours(0, 0, 0, 0)
  
  const endOfSelectedDay = new Date(date)
  endOfSelectedDay.setHours(23, 59, 59, 999)

  const q = query(
    collection(db, 'schedule'),
    where('userId', '==', userId),
    where('date', '>=', Timestamp.fromDate(startOfSelectedDay)),
    where('date', '<=', Timestamp.fromDate(endOfSelectedDay))
  )
  
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ScheduleEvent[]
    
    events.sort((a, b) => a.start.localeCompare(b.start))
    callback(events)
  })
}

export const createScheduleEvent = async (userId: string, eventData: CreateScheduleEvent) => {
  const dateAtMidnight = new Date(eventData.date)
  dateAtMidnight.setHours(0, 0, 0, 0)
  
  return await addDoc(collection(db, 'schedule'), {
    ...eventData,
    userId,
    date: Timestamp.fromDate(dateAtMidnight),
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