import { useEffect, useState } from 'react'
import { store } from '@/lib/store'

export function useStore() {
  const [data, setData] = useState(store.data)

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setData({ ...store.data })
    })
    return unsubscribe
  }, [])

  return {
    data,
    updateTasks: store.updateTasks.bind(store),
    updateAssignments: store.updateAssignments.bind(store),
    updateHabits: store.updateHabits.bind(store),
    updateEvents: store.updateEvents.bind(store),
    updateBudget: store.updateBudget.bind(store),
    completeStudySession: store.completeStudySession.bind(store)
  }
}