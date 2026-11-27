import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Favorites.module.css'
import { getAll } from '../../services/destinationService'
import { getFavorites, saveFavorites } from '../../services/favoriteService'
import DestinationCard from '../../components/DestinationCard/DestinationCard'

const COMPARE_KEY = 'tripcraft_compare'

export default function Favorites() {
  const navigate = useNavigate()

  const [destinations, setDestinations] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [compareIds, setCompareIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPARE_KEY)) || []
    } catch {
      return []
    }
  })
  const [compareNotice, setCompareNotice] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadFavorites() {
      try {
        const [allDestinations, savedFavorites] = await Promise.all([
          getAll(),
          getFavorites(),
        ])

        if (isMounted) {
          setDestinations(allDestinations || [])
          setFavoriteIds(savedFavorites || [])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadFavorites()
    return () => {
      isMounted = false
    }
  }, [])

  const favoriteDestinations = destinations.filter((dest) =>
    favoriteIds.includes(dest.id)
  )

  const handleToggleFavorite = async (id) => {
    const updated = favoriteIds.filter((favId) => favId !== id)
    setFavoriteIds(updated)
    await saveFavorites(updated)
  }

  const handleClearAllFavorites = async () => {
    setFavoriteIds([])
    await saveFavorites([])
  }

  const handleToggleCompare = (id) => {
    setCompareNotice('')

    if (compareIds.includes(id)) {
      const updated = compareIds.filter((itemId) => itemId !== id)
      setCompareIds(updated)
      localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
      return
    }

    if (compareIds.length >= 3) {
      setCompareNotice('You can compare up to 3 destinations at the same time.')
      return
    }

    const updated = [...compareIds, id]
    setCompareIds(updated)
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topHeader}>
          <div>
            <h1 className={styles.title}>Favorite Destinations</h1>
            <p className={styles.subtitle}>
              All the places you saved for your upcoming trips in one spot.
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate('/destinations')}
            >
              Explore More
            </button>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/compare')}
            >
              Compare ({compareIds.length})
            </button>

            {favoriteDestinations.length > 0 && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClearAllFavorites}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {compareNotice && <p className={styles.notice}>{compareNotice}</p>}

        {loading ? (
          <div className={styles.stateBox}>Loading your favorites...</div>
        ) : favoriteDestinations.length === 0 ? (
          <div className={styles.stateBox}>
            <h2 className={styles.emptyTitle}>No favorite destinations yet</h2>
            <p className={styles.emptyText}>
              Tap the heart icon on any city to save it here and find it easily
              later.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/destinations')}
            >
              Discover Destinations
            </button>
          </div>
        ) : (
          <>
            <p className={styles.countText}>
              You have <strong>{favoriteDestinations.length}</strong> saved{' '}
              {favoriteDestinations.length === 1 ? 'destination' : 'destinations'}
            </p>

            <div className={styles.grid}>
              {favoriteDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  isCompared={compareIds.includes(destination.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}