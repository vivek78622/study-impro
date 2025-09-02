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
import { StudySession } from '../../models'

export const subscribeToStudySessions = (userId: string, callback: (sessions: StudySession[]) => void) => {
  const q = query(
    collection(db, 'studySessions'),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as StudySession[]
    
    callback(sessions)
  })
}

export const createStudySession = async (userId: string, sessionData: Omit<StudySession, 'id' | 'userId'>) => {
  return await addDoc(collection(db, 'studySessions'), {
    ...sessionData,
    userId,
    startTime: serverTimestamp()
  })
}

export const updateStudySession = async (sessionId: string, updates: Partial<StudySession>) => {
  return await updateDoc(doc(db, 'studySessions', sessionId), updates)
}

export const deleteStudySession = async (sessionId: string) => {
  return await deleteDoc(doc(db, 'studySessions', sessionId))
}