// Mock login for now. Replace with a real API call (api.js) when the backend is ready.
export const login = async (email, password) => {
  return { id: 1, name: 'Demo User', email }
}

export const register = async (data) => {
  return { id: 1, name: data.name, email: data.email }
}
