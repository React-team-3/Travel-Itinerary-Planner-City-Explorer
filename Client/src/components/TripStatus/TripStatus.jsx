import React from 'react'
import styles from './TripStatus.module.css'


const statusStyle = {
  Upcoming: styles.upcoming,
  Ongoing: styles.ongoing,
  Completed: styles.completed,
}

export default function TripStatus({ status }) {
  return (
    <span className={`${styles.badge} ${statusStyle[status] || styles.completed}`}>
      <span className={styles.dot} />
      {status}
    </span>
  )
}

