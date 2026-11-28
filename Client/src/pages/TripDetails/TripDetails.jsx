import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getById } from '../../services/tripService'
import { getAll as getAllActivities } from '../../services/activityService'
import TripStatus from '../../components/TripStatus/TripStatus'
import TripSummary from '../../components/TripSummary/TripSummary'
import styles from './TripDetails.module.css'

export default function TripDetails() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const foundTrip = await getById(id)
      const allActivities = await getAllActivities()

      setTrip(foundTrip)
      setActivities(allActivities.filter((activity) => String(activity.tripId) === String(id)))
      setLoading(false)
    }

    load()
  }, [id])

  if (loading) {
    return <p className={styles.loading}>Loading trip...</p>
  }

  if (!trip) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>
          This trip was not found. <Link to='/trips'>Back to My Trips</Link>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link to='/trips' className={styles.back}>
        &larr; Back to My Trips
      </Link>

      <div className={styles.hero}>
        <img src={trip.image} alt={trip.destinationName} className={styles.heroImage} />
        <div className={styles.heroBody}>
          <div>
            <h2 className={styles.title}>{trip.name}</h2>
            <p className={styles.subtitle}>
              <i className='fa-solid fa-location-dot' aria-hidden='true' />
              {trip.destinationName}
            </p>
          </div>
          <TripStatus status={trip.status} />
        </div>
      </div>

      <div className={styles.columns}>
        <TripSummary trip={trip} activitiesCount={activities.length} />

        <div className={styles.nextSteps}>
          <h5 className={styles.nextStepsTitle}>Next steps</h5>
          <Link to={`/itinerary?tripId=${trip.id}`} className={styles.primaryButton}>
            Open itinerary
          </Link>
          <Link to={`/map?tripId=${trip.id}`} className={styles.secondaryButton}>
            View places on the map
          </Link>
          <Link to={`/budget?tripId=${trip.id}`} className={styles.secondaryButton}>
            Budget and expenses
          </Link>
        </div>
      </div>
    </div>
  )
}
