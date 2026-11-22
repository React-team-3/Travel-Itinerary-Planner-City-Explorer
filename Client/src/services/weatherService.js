import { mockWeather } from '../data/mockWeather'

// Mock service. Later we only change the inside of these functions to call the real API.
export const getAll = async () => {
  return mockWeather
}

export const getById = async (id) => {
  return mockWeather.find((item) => String(item.id) === String(id))
}
