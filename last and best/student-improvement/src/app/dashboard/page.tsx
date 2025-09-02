"use client"

import ProtectedRoute from '../../components/ProtectedRoute'
import EnhancedDashboard from '../../components/dashboard/EnhancedDashboard'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <EnhancedDashboard />
    </ProtectedRoute>
  )
}