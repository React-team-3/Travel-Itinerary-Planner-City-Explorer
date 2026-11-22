import { mockActivities } from '../data/mockActivities'

// Mock service. Later we only change the inside of these functions to call the real API.
export const getAll = async () => {
  return mockActivities
}

export const getById = async (id) => {
  return mockActivities.find((item) => String(item.id) === String(id))
}
