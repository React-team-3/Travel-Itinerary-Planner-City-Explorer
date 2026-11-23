import { mockNotifications } from '../data/mockNotifications'

// Mock service. Later we only change the inside of these functions to call the real API.
export const getAll = async () => {
  return mockNotifications
}

export const getById = async (id) => {
  return mockNotifications.find((item) => String(item.id) === String(id))
}
