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
  setDoc 
} from 'firebase/firestore'
import { db } from '../../firebase'

interface BudgetSettings {
  id?: string
  userId: string
  monthlyBudget: number
  categoryBudgets: Record<string, number>
  createdAt?: any
  updatedAt?: any
}

export const subscribeToBudgetSettings = (userId: string, callback: (budget: BudgetSettings | null) => void) => {
  const q = query(
    collection(db, 'budgetSettings'),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (snapshot) => {
    const budgets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BudgetSettings[]
    
    callback(budgets.length > 0 ? budgets[0] : null)
  })
}

export const saveBudgetSettings = async (userId: string, monthlyBudget: number, categoryBudgets: Record<string, number>) => {
  const budgetDoc = doc(db, 'budgetSettings', userId)
  return await setDoc(budgetDoc, {
    userId,
    monthlyBudget,
    categoryBudgets,
    updatedAt: serverTimestamp()
  }, { merge: true })
}