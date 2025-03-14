import React from 'react'
import { AuthGuardProps } from '../../types/auth'

const ProtectedRoute = ({ children }: AuthGuardProps) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute
