import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved =
      localStorage.getItem('tripcraft_user') || sessionStorage.getItem('tripcraft_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (userData, rememberMe) => {
    setUser(userData)
    if (rememberMe) {
      localStorage.setItem('tripcraft_user', JSON.stringify(userData))
      sessionStorage.removeItem('tripcraft_user')
    } else {
      sessionStorage.setItem('tripcraft_user', JSON.stringify(userData))
      localStorage.removeItem('tripcraft_user')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tripcraft_user')
    sessionStorage.removeItem('tripcraft_user')
  }

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)

    // keep the session in the same place it was saved
    if (localStorage.getItem('tripcraft_user')) {
      localStorage.setItem('tripcraft_user', JSON.stringify(newUser))
    } else {
      sessionStorage.setItem('tripcraft_user', JSON.stringify(newUser))
    }

    const users = JSON.parse(localStorage.getItem('tripcraft_users') || '[]')
    const updatedUsers = users.map((u) => (u.id === newUser.id ? { ...u, ...updatedData } : u))
    localStorage.setItem('tripcraft_users', JSON.stringify(updatedUsers))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}