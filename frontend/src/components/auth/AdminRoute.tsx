import React from 'react'
import { AuthGuardProps } from '../../types/auth'

const AdminRoute = ({ children }: AuthGuardProps) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default AdminRoute
