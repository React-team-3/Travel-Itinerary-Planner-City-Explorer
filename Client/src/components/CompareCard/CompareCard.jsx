import React from 'react'
import { Link } from 'react-router-dom'
import styles from './CompareCard.module.css'

export default function CompareCard({
  destination,
  onRemove,
  isBestValue = false,
}) {
  if (!destination) return null

  return (
    <article
      className={`${styles.card} ${isBestValue ? styles.bestValueCard : ''}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={destination.image}
          alt={destination.name}
          className={styles.image}
        />

        {isBestValue && (
          <span className={styles.bestBadge}>Best Value</span>
        )}

        {onRemove && (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onRemove(destination.id)}
            aria-label={`Remove ${destination.name} from comparison`}
            title="Remove from comparison"
          >
            ×
          </button>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.name}>{destination.name}</h3>
          <p className={styles.country}>{destination.country}</p>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Average Cost</span>
          <strong className={styles.costValue}>${destination.avgCost}</strong>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Budget Level</span>
          <span className={styles.priceBadge}>{destination.priceLevel}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Best Time</span>
          <span className={styles.value}>{destination.bestTime}</span>
        </div>

        <div className={styles.block}>
          <span className={styles.label}>Travel Style</span>
          <div className={styles.tags}>
            {(destination.tags || []).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {destination.attractions && destination.attractions.length > 0 && (
          <div className={styles.block}>
            <span className={styles.label}>Top Attractions</span>
            <ul className={styles.attractions}>
              {destination.attractions.map((place) => (
                <li key={place} className={styles.attractionItem}>
                  {place}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.footer}>
          <Link
            to={`/destinations/${destination.id}`}
            className={styles.detailsBtn}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}