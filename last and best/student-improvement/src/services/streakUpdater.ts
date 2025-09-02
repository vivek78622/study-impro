import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'

export const updateAllHabitStreaks = async () => {
  try {
    const habitsQuery = query(collection(db, 'habits'))
    const snapshot = await getDocs(habitsQuery)
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const batch = []
    
    snapshot.docs.forEach((habitDoc) => {
      const habit = habitDoc.data()
      const lastCompleted = habit.lastCompleted?.toDate ? habit.lastCompleted.toDate() : null
      const lastCompletedDate = lastCompleted ? new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()) : null
      
      // Check if habit was completed today
      const completedToday = lastCompletedDate && lastCompletedDate.getTime() === today.getTime()
      
      // Reset streak if more than 1 day gap
      let currentStreak = habit.streak || 0
      if (lastCompletedDate && !completedToday) {
        const daysDiff = Math.floor((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff > 1) {
          currentStreak = 0
        }
      }
      
      // Only update if streak changed
      if (currentStreak !== habit.streak) {
        batch.push(updateDoc(doc(db, 'habits', habitDoc.id), {
          streak: currentStreak,
          completedToday: completedToday || false
        }))
      }
    })
    
    await Promise.all(batch)
    console.log('Habit streaks updated successfully')
  } catch (error) {
    console.error('Error updating habit streaks:', error)
  }
}