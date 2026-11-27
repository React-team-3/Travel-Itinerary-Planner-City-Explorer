import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CompareDestinations.module.css'
import { getAll } from '../../services/destinationService'
import CompareCard from '../../components/CompareCard/CompareCard'

const COMPARE_KEY = 'tripcraft_compare'

export default function CompareDestinations() {
  const navigate = useNavigate()

  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedToAdd, setSelectedToAdd] = useState('')
  const [compareIds, setCompareIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPARE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    let isMounted = true

    async function loadDestinations() {
      try {
        const allDestinations = await getAll()
        if (isMounted) {
          setDestinations(allDestinations || [])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDestinations()
    return () => {
      isMounted = false
    }
  }, [])

  const comparedDestinations = useMemo(() => {
    return compareIds
      .map((id) => destinations.find((item) => item.id === id))
      .filter(Boolean)
  }, [compareIds, destinations])

  const availableDestinations = useMemo(() => {
    return destinations.filter((item) => !compareIds.includes(item.id))
  }, [destinations, compareIds])

  const lowestCost = useMemo(() => {
    if (comparedDestinations.length < 2) return null
    return Math.min(...comparedDestinations.map((item) => item.avgCost))
  }, [comparedDestinations])

  const handleAddDestination = () => {
    if (!selectedToAdd || compareIds.length >= 3) return
    const idNumber = Number(selectedToAdd)
    if (compareIds.includes(idNumber)) return

    const updated = [...compareIds, idNumber]
    setCompareIds(updated)
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
    setSelectedToAdd('')
  }

  const handleRemove = (id) => {
    const updated = compareIds.filter((itemId) => itemId !== id)
    setCompareIds(updated)
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
  }

  const handleClearAll = () => {
    setCompareIds([])
    localStorage.setItem(COMPARE_KEY, JSON.stringify([]))
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topHeader}>
          <div>
            <h1 className={styles.title}>Compare Destinations</h1>
            <p className={styles.subtitle}>
              Compare up to 3 cities side by side by budget, best season, travel
              style, and top attractions.
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate('/destinations')}
            >
              Back to Discover
            </button>

            {comparedDestinations.length > 0 && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClearAll}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {!loading && compareIds.length < 3 && availableDestinations.length > 0 && (
          <div className={styles.pickerBar}>
            <label htmlFor="compare-picker" className={styles.pickerLabel}>
              Add a destination ({compareIds.length}/3):
            </label>

            <div className={styles.pickerControls}>
              <select
                id="compare-picker"
                className={styles.select}
                value={selectedToAdd}
                onChange={(e) => setSelectedToAdd(e.target.value)}
              >
                <option value="">Choose a city...</option>
                {availableDestinations.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.country}) - ${city.avgCost}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className={styles.addBtn}
                onClick={handleAddDestination}
                disabled={!selectedToAdd}
              >
                Add to Compare
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.stateBox}>Loading destinations...</div>
        ) : comparedDestinations.length === 0 ? (
          <div className={styles.stateBox}>
            <h2 className={styles.emptyTitle}>No destinations selected yet</h2>
            <p className={styles.emptyText}>
              Pick cities from the selector above or click &quot;Compare&quot; on
              any city card to see them side by side.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/destinations')}
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <>
            {comparedDestinations.length === 1 && (
              <p className={styles.hint}>
                Add one or two more cities above to compare costs and highlights
                side by side.
              </p>
            )}

            <div className={styles.grid}>
              {comparedDestinations.map((destination) => (
                <CompareCard
                  key={destination.id}
                  destination={destination}
                  onRemove={handleRemove}
                  isBestValue={
                    lowestCost !== null && destination.avgCost === lowestCost
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}