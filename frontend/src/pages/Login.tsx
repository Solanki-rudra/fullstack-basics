import React from 'react'
import LoginForm from '../components/forms/LoginForm'
import { Card } from 'antd'

const Login = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card title="Login">
        <LoginForm />
      </Card>
    </div>
  )
}

export default Login
