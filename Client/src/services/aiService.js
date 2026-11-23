import { mockGeneratedPlans } from '../data/mockGeneratedPlans'

// Mock service. Later we only change the inside of these functions to call the real API.
export const getAll = async () => {
  return mockGeneratedPlans
}

export const getById = async (id) => {
  return mockGeneratedPlans.find((item) => String(item.id) === String(id))
}
