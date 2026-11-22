import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
