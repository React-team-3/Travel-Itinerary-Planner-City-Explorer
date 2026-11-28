import React from 'react'
import { Link } from 'react-router-dom'
import TripStatus from '../TripStatus/TripStatus'
import styles from './TripCard.module.css'

// One horizontal trip card for the My Trips list.
export default function TripCard({ trip }) {
  return (
    <article className={styles.card}>
      <img src={trip.image} alt={trip.destinationName} className={styles.image} />

      <div className={styles.body}>
        <h3 className={styles.name}>{trip.name}</h3>
        <p className={styles.dates}>
          {trip.startDate} - {trip.endDate}
        </p>

        <TripStatus status={trip.status} />

        <p className={styles.place}>
          <i className='fa-solid fa-location-dot' aria-hidden='true' />
          {trip.destinationName}
        </p>

        <Link to={`/trips/${trip.id}`} className={styles.detailsButton}>
          View Details
        </Link>
      </div>
    </article>
  )
}
