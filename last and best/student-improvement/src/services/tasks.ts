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
import { Task } from '../../models'

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[]
    callback(tasks)
  })
}

export const createTask = async (userId: string, taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
  return await addDoc(collection(db, 'tasks'), {
    ...taskData,
    userId,
    createdAt: serverTimestamp()
  })
}

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  return await updateDoc(doc(db, 'tasks', taskId), updates)
}

export const deleteTask = async (taskId: string) => {
  return await deleteDoc(doc(db, 'tasks', taskId))
}