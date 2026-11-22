import { mockDestinations } from '../data/mockDestinations'

// Mock service. Later we only change the inside of these functions to call the real API.
export const getAll = async () => {
  return mockDestinations
}

export const getById = async (id) => {
  return mockDestinations.find((item) => String(item.id) === String(id))
}
