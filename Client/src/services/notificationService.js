import { mockNotifications } from '../data/mockNotifications'

const KEY = 'tripcraft_notifications'

// Mock service: notifications are stored in localStorage until the backend is ready.
// Every function returns the updated list.

export const getNotifications = async () => {
  const saved = localStorage.getItem(KEY)
  if (!saved) {
    localStorage.setItem(KEY, JSON.stringify(mockNotifications))
    return mockNotifications
  }
  return JSON.parse(saved)
}

export const markAsRead = async (id) => {
  const list = JSON.parse(localStorage.getItem(KEY) || '[]')
  const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n))
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export const markAllAsRead = async () => {
  const list = JSON.parse(localStorage.getItem(KEY) || '[]')
  const updated = list.map((n) => ({ ...n, isRead: true }))
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export const deleteNotification = async (id) => {
  const list = JSON.parse(localStorage.getItem(KEY) || '[]')
  const updated = list.filter((n) => n.id !== id)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export const deleteAll = async () => {
  localStorage.setItem(KEY, JSON.stringify([]))
  return []
}