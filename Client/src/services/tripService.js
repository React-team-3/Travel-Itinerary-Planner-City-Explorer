import { mockTrips } from '../data/mockTrips'

// Mock service. Later we only change the inside of these functions to call the real API.
export const getAll = async () => {
  return mockTrips
}

export const getById = async (id) => {
  return mockTrips.find((item) => String(item.id) === String(id))
}
