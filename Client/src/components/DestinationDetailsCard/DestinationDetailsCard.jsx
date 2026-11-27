import React from 'react'
import styles from './DestinationDetailsCard.module.css'

export default function DestinationDetailsCard({
  destination,
  isFavorite = false,
  onToggleFavorite,
  isCompared = false,
  onToggleCompare,
}) {
  if (!destination) return null

  return (
    <article className={styles.card}>
      <div className={styles.heroWrapper}>
        <img
          src={destination.image}
          alt={destination.name}
          className={styles.heroImage}
        />
        <span className={styles.priceBadge}>{destination.priceLevel}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{destination.name}</h1>
            <p className={styles.country}>{destination.country}</p>
          </div>

          <div className={styles.actions}>
            {onToggleFavorite && (
              <button
                type="button"
                className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
                onClick={() => onToggleFavorite(destination.id)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}</span>
              </button>
            )}

            {onToggleCompare && (
              <button
                type="button"
                className={`${styles.compareBtn} ${
                  isCompared ? styles.compareActive : ''
                }`}
                onClick={() => onToggleCompare(destination.id)}
              >
                {isCompared ? 'In Compare List ✓' : 'Add to Compare'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Average Cost</span>
            <strong className={styles.statValue}>${destination.avgCost}</strong>
          </div>

          <div className={styles.statBox}>
            <span className={styles.statLabel}>Budget Level</span>
            <strong className={styles.statValue}>{destination.priceLevel}</strong>
          </div>

          <div className={styles.statBox}>
            <span className={styles.statLabel}>Best Time to Visit</span>
            <strong className={styles.statValue}>{destination.bestTime}</strong>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>About {destination.name}</h2>
          <p className={styles.description}>{destination.description}</p>
        </div>

        {destination.tags && destination.tags.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Travel Style</h2>
            <div className={styles.tags}>
              {destination.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {destination.attractions && destination.attractions.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Top Attractions</h2>
            <ul className={styles.attractionsList}>
              {destination.attractions.map((place) => (
                <li key={place} className={styles.attractionItem}>
                  <span className={styles.bullet}>•</span>
                  <span>{place}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}