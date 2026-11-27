import React from 'react'
import { Link } from 'react-router-dom'
import styles from './DestinationCard.module.css'

export default function DestinationCard({
  destination,
  isFavorite = false,
  onToggleFavorite,
  isCompared = false,
  onToggleCompare,
}) {
  if (!destination) return null

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={destination.image}
          alt={destination.name}
          className={styles.image}
          loading="lazy"
        />

        <span className={styles.priceBadge}>{destination.priceLevel}</span>

        {onToggleFavorite && (
          <button
            type="button"
            className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
            onClick={() => onToggleFavorite(destination.id)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
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
          </button>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.name}>{destination.name}</h3>
            <p className={styles.country}>{destination.country}</p>
          </div>
          <span className={styles.cost}>${destination.avgCost}</span>
        </div>

        <p className={styles.description}>{destination.description}</p>

        {destination.tags && destination.tags.length > 0 && (
          <div className={styles.tags}>
            {destination.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <Link
            to={`/destinations/${destination.id}`}
            className={styles.detailsBtn}
          >
            View Details
          </Link>

          {onToggleCompare && (
            <button
              type="button"
              className={`${styles.compareBtn} ${
                isCompared ? styles.compareActive : ''
              }`}
              onClick={() => onToggleCompare(destination.id)}
            >
              {isCompared ? 'Compared ✓' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
