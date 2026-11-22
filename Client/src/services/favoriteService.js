const KEY = 'tripcraft_favorites'

export const getFavorites = async () => {
  return JSON.parse(localStorage.getItem(KEY)) || []
}

export const saveFavorites = async (list) => {
  localStorage.setItem(KEY, JSON.stringify(list))
}
