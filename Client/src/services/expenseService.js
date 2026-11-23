import { mockExpenses } from '../data/mockExpenses'

// Mock service. Later we only change the inside of these functions to call the real API.
export const getAll = async () => {
  return mockExpenses
}

export const getById = async (id) => {
  return mockExpenses.find((item) => String(item.id) === String(id))
}
