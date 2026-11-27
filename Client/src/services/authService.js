// Mock auth service: users are stored in localStorage until the backend is ready.
// Errors have the same shape as axios errors (error.response.data.message),
// so Register.jsx and Login.jsx will not change when we connect the real API.
const USERS_KEY = 'tripcraft_users'
export const register = async (data) => {
  const users = JSON.parse(localStorage.getItem('tripcraft_users') || '[]')

  const exists = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())
  if (exists) {
    const error = new Error('Email already registered')
    error.response = { data: { message: 'This email is already registered' } }
    throw error
  }

  const newUser = {
    id: Date.now(),
    name: data.name,
    email: data.email,
    password: data.password,
  }
  users.push(newUser)
  localStorage.setItem('tripcraft_users', JSON.stringify(users))

  const user = { ...newUser }
  delete user.password
  return user
}

export const login = async (email, password) => {
  const users = JSON.parse(localStorage.getItem('tripcraft_users') || '[]')

  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!found) {
    const error = new Error('Invalid credentials')
    error.response = { data: { message: 'Invalid email or password' } }
    throw error
  }

  const user = { ...found }
  delete user.password
  return user
}
// Reset password
export const resetPassword = async (email, newPassword) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

  const index = users.findIndex(
    user => user.email.toLowerCase() === email.toLowerCase()
  )

  if (index === -1) {
    throw new Error('Account not found')
  }

  users[index].password = newPassword
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}