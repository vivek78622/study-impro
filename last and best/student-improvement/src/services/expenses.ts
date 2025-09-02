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
import { Expense } from '../../models'

export const subscribeToExpenses = (userId: string, callback: (expenses: Expense[]) => void) => {
  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expense[]
    
    callback(expenses)
  })
}

export const createExpense = async (userId: string, expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
  return await addDoc(collection(db, 'expenses'), {
    ...expenseData,
    userId,
    createdAt: serverTimestamp()
  })
}

export const updateExpense = async (expenseId: string, updates: Partial<Expense>) => {
  return await updateDoc(doc(db, 'expenses', expenseId), updates)
}

export const deleteExpense = async (expenseId: string) => {
  return await deleteDoc(doc(db, 'expenses', expenseId))
}