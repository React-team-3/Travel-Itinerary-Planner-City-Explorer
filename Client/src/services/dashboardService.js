import { mockDashboard } from '../data/mockDashboard'

// Mock service. Later we only change the inside of these functions to call the real API.
export const getAll = async () => {
  return mockDashboard
}

export const getById = async (id) => {
  return mockDashboard.find((item) => String(item.id) === String(id))
}
