import React from 'react'

// Login is mock-only in this phase, so this does NOT block anything yet.
// When the backend is ready: if there is no user -> <Navigate to="/login" />
export default function ProtectedRoute({ children }) {
  return children
}
