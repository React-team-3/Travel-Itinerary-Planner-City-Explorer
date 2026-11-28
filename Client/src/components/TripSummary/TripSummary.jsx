import React from 'react'
import styles from './TripSummary.module.css'

// Days between two "YYYY-MM-DD" dates, counting the first and the last day.
function countDays(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000
  const diff = (new Date(endDate) - new Date(startDate)) / oneDay
  return Math.max(1, Math.round(diff) + 1)
}

// The facts block on the Trip Details page.
export default function TripSummary({ trip, activitiesCount }) {
  const rows = [
    { label: 'Destination', value: trip.destinationName },
    { label: 'Dates', value: `${trip.startDate} - ${trip.endDate}` },
    { label: 'Duration', value: `${countDays(trip.startDate, trip.endDate)} days` },
    { label: 'Travelers', value: trip.travelers },
    { label: 'Budget', value: trip.budget },
    { label: 'Planned activities', value: activitiesCount },
  ]

  return (
    <div className={styles.card}>
      <h5 className={styles.title}>Trip summary</h5>
      <dl className={styles.grid}>
        {rows.map((row) => (
          <div className={styles.item} key={row.label}>
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
