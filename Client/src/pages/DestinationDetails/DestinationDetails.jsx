import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './DestinationDetails.module.css'
import { getAll } from '../../services/destinationService'
import { getFavorites, saveFavorites } from '../../services/favoriteService'
import DestinationDetailsCard from '../../components/DestinationDetailsCard/DestinationDetailsCard'

const COMPARE_KEY = 'tripcraft_compare'

export default function DestinationDetails() {
  const params = useParams()
  const id = params.id || params.destinationId
  const navigate = useNavigate()

  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState([])
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

    async function loadDetails() {
      try {
        const [allDestinations, savedFavorites] = await Promise.all([
          getAll(),
          getFavorites(),
        ])

        if (isMounted) {
          const found = (allDestinations || []).find(
            (item) => String(item.id) === String(id)
          )
          setDestination(found || null)
          setFavoriteIds(savedFavorites || [])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDetails()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleToggleFavorite = async (destId) => {
    const updated = favoriteIds.includes(destId)
      ? favoriteIds.filter((favId) => favId !== destId)
      : [...favoriteIds, destId]

    setFavoriteIds(updated)
    await saveFavorites(updated)
  }

  const handleToggleCompare = (destId) => {
    setCompareNotice('')

    if (compareIds.includes(destId)) {
      const updated = compareIds.filter((itemId) => itemId !== destId)
      setCompareIds(updated)
      localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
      return
    }

    if (compareIds.length >= 3) {
      setCompareNotice('You can compare up to 3 destinations at the same time.')
      return
    }

    const updated = [...compareIds, destId]
    setCompareIds(updated)
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('/destinations')}
          >
            ← Back to Destinations
          </button>

          <div className={styles.quickLinks}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate('/favorites')}
            >
              Favorites ({favoriteIds.length})
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/compare')}
            >
              Compare ({compareIds.length})
            </button>
          </div>
        </div>

        {compareNotice && <p className={styles.notice}>{compareNotice}</p>}

        {loading ? (
          <div className={styles.stateBox}>Loading destination details...</div>
        ) : !destination ? (
          <div className={styles.stateBox}>
            <h2 className={styles.notFoundTitle}>Destination not found</h2>
            <p className={styles.notFoundText}>
              The destination you are looking for does not exist.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/destinations')}
            >
              Explore All Destinations
            </button>
          </div>
        ) : (
          <DestinationDetailsCard
            destination={destination}
            isFavorite={favoriteIds.includes(destination.id)}
            onToggleFavorite={handleToggleFavorite}
            isCompared={compareIds.includes(destination.id)}
            onToggleCompare={handleToggleCompare}
          />
        )}
      </div>
    </section>
  )
}