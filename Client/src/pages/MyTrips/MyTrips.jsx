import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll } from '../../services/tripService'
import TripCard from '../../components/TripCard/TripCard'
import styles from './MyTrips.module.css'

const TABS = ['Upcoming', 'Ongoing', 'Completed']

export default function MyTrips() {
  const [trips, setTrips] = useState([])
  const [tab, setTab] = useState('Upcoming')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAll().then((data) => {
      setTrips(data)
      setLoading(false)
    })
  }, [])

  const visibleTrips = trips.filter((trip) => trip.status === tab)

  if (loading) {
    return <p className={styles.loading}>Loading your trips...</p>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Trips</h2>
          <p className={styles.subtitle}>Adventures, big and small, they're all here.</p>
        </div>

        <Link to='/trips/create' className={styles.createButton}>
          + Create Trip
        </Link>
      </div>

      <div className={styles.tabs}>
        {TABS.map((item) => (
          <button
            key={item}
            type='button'
            className={`${styles.tab} ${tab === item ? styles.activeTab : ''}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleTrips.length === 0 ? (
        <p className={styles.empty}>No {tab.toLowerCase()} trips yet.</p>
      ) : (
        <div className={styles.list}>
          {visibleTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}
