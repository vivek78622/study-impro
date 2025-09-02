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
import { Assignment } from '../../models'

export const subscribeToAssignments = (userId: string, callback: (assignments: Assignment[]) => void) => {
  const q = query(
    collection(db, 'assignments'),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (snapshot) => {
    const assignments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Assignment[]
    
    assignments.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    callback(assignments)
  })
}

export const createAssignment = async (userId: string, assignmentData: Omit<Assignment, 'id' | 'userId'>) => {
  return await addDoc(collection(db, 'assignments'), {
    ...assignmentData,
    userId,
    createdAt: serverTimestamp()
  })
}

export const updateAssignment = async (assignmentId: string, updates: Partial<Assignment>) => {
  if (!assignmentId) {
    throw new Error('Assignment ID is required for update')
  }
  return await updateDoc(doc(db, 'assignments', assignmentId), updates)
}

export const deleteAssignment = async (assignmentId: string) => {
  if (!assignmentId) {
    throw new Error('Assignment ID is required for deletion')
  }
  return await deleteDoc(doc(db, 'assignments', assignmentId))
}