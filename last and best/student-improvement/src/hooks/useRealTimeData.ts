import { useEffect, useState } from 'react'
import { store } from '@/lib/store'

// Real-time data update hook
export const useRealTimeData = () => {
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  useEffect(() => {
    try {
      // Start the store's real-time sync
      store.startRealTimeSync()

      // Listen for store updates
      const unsubscribe = store.subscribe(() => {
        setLastUpdate(Date.now())
        setIsConnected(store.data.isOnline)
      })

      // Cleanup on unmount
      return () => {
        try {
          store.stopRealTimeSync()
          unsubscribe()
        } catch (error) {
          console.warn('Error during cleanup:', error)
        }
      }
    } catch (error) {
      console.error('Failed to initialize real-time data:', error)
      setIsConnected(false)
    }
  }, [])

  // Manual refresh function
  const refreshData = () => {
    try {
      store.refreshData()
    } catch (error) {
      console.error('Failed to refresh data:', error)
    }
  }

  return { 
    isConnected, 
    lastUpdate, 
    refreshData 
  }
}