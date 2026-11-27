import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './DiscoverDestinations.module.css'
import { getAll } from '../../services/destinationService'
import { getFavorites, saveFavorites } from '../../services/favoriteService'
import useDebounce from '../../hooks/useDebounce'
import SearchBar from '../../components/SearchBar/SearchBar'
import DestinationFilters from '../../components/DestinationFilters/DestinationFilters'
import DestinationCard from '../../components/DestinationCard/DestinationCard'

const COMPARE_KEY = 'tripcraft_compare'

export default function DiscoverDestinations() {
  const navigate = useNavigate()

  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [favoriteIds, setFavoriteIds] = useState([])
  const [compareIds, setCompareIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPARE_KEY)) || []
    } catch {
      return []
    }
  })
  const [compareNotice, setCompareNotice] = useState('')

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
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

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const countries = useMemo(() => {
    return [...new Set(destinations.map((item) => item.country))].sort()
  }, [destinations])

  const tags = useMemo(() => {
    const allTags = destinations.flatMap((item) => item.tags || [])
    return [...new Set(allTags)].sort()
  }, [destinations])

  const filteredDestinations = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()

    return destinations.filter((dest) => {
      const matchesSearch =
        !query ||
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query) ||
        (dest.tags || []).some((tag) => tag.toLowerCase().includes(query))

      const matchesCountry = !selectedCountry || dest.country === selectedCountry
      const matchesPrice = !selectedPrice || dest.priceLevel === selectedPrice
      const matchesTag =
        !selectedTag || (dest.tags || []).includes(selectedTag)

      return matchesSearch && matchesCountry && matchesPrice && matchesTag
    })
  }, [destinations, debouncedSearch, selectedCountry, selectedPrice, selectedTag])

  const handleToggleFavorite = async (id) => {
    const updated = favoriteIds.includes(id)
      ? favoriteIds.filter((favId) => favId !== id)
      : [...favoriteIds, id]

    setFavoriteIds(updated)
    await saveFavorites(updated)
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

  const handleClearCompare = () => {
    setCompareIds([])
    setCompareNotice('')
    localStorage.setItem(COMPARE_KEY, JSON.stringify([]))
  }

  const handleResetFilters = () => {
    setSelectedCountry('')
    setSelectedPrice('')
    setSelectedTag('')
  }

  const handleResetAll = () => {
    setSearch('')
    handleResetFilters()
  }

  const selectedCompareCities = destinations.filter((dest) =>
    compareIds.includes(dest.id)
  )

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topHeader}>
          <div>
            <h1 className={styles.title}>Discover Destinations</h1>
            <p className={styles.subtitle}>
              Explore cities around the world, filter by budget or travel style,
              and save your favorites.
            </p>
          </div>

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

        <div className={styles.controls}>
          <SearchBar value={search} onChange={setSearch} />
          <DestinationFilters
            countries={countries}
            tags={tags}
            selectedCountry={selectedCountry}
            selectedPrice={selectedPrice}
            selectedTag={selectedTag}
            onCountryChange={setSelectedCountry}
            onPriceChange={setSelectedPrice}
            onTagChange={setSelectedTag}
            onReset={handleResetFilters}
          />
        </div>

        {compareNotice && <p className={styles.notice}>{compareNotice}</p>}

        {selectedCompareCities.length > 0 && (
          <div className={styles.compareBar}>
            <div className={styles.compareInfo}>
              <span className={styles.compareLabel}>Selected to compare:</span>
              <div className={styles.compareChips}>
                {selectedCompareCities.map((city) => (
                  <span key={city.id} className={styles.chip}>
                    {city.name}
                    <button
                      type="button"
                      className={styles.chipRemove}
                      onClick={() => handleToggleCompare(city.id)}
                      aria-label={`Remove ${city.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.compareActions}>
              <button
                type="button"
                className={styles.clearCompareBtn}
                onClick={handleClearCompare}
              >
                Clear
              </button>
              <button
                type="button"
                className={styles.goCompareBtn}
                onClick={() => navigate('/compare')}
              >
                Compare Now
              </button>
            </div>
          </div>
        )}

        <p className={styles.resultsCount}>
          Showing <strong>{filteredDestinations.length}</strong> of{' '}
          <strong>{destinations.length}</strong> destinations
        </p>

        {loading ? (
          <div className={styles.stateBox}>Loading destinations...</div>
        ) : filteredDestinations.length === 0 ? (
          <div className={styles.stateBox}>
            <h3 className={styles.emptyTitle}>No destinations found</h3>
            <p className={styles.emptyText}>
              Try changing your search keyword or clearing the active filters.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleResetAll}
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isFavorite={favoriteIds.includes(destination.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompared={compareIds.includes(destination.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}