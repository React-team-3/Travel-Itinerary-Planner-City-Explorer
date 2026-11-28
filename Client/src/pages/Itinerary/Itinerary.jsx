import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAll as getAllTrips } from '../../services/tripService'
import { getAll as getAllActivities } from '../../services/activityService'
import DaySelector from '../../components/DaySelector/DaySelector'
import ActivityTimeline from '../../components/ActivityTimeline/ActivityTimeline'
import ActivityForm from '../../components/ActivityForm/ActivityForm'
import styles from './Itinerary.module.css'

// Days between two "YYYY-MM-DD" dates, counting the first and the last day.
function countDays(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000
  const diff = (new Date(endDate) - new Date(startDate)) / oneDay
  return Math.max(1, Math.round(diff) + 1)
}

// "09:30" -> "9:30 AM"
function to12Hour(time) {
  const [hour, minute] = time.split(':').map(Number)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`
}

// Every pair of activities on the same day whose times overlap.
function findOverlaps(activities) {
  const overlaps = []

  for (let i = 0; i < activities.length; i += 1) {
    for (let j = i + 1; j < activities.length; j += 1) {
      const first = activities[i]
      const second = activities[j]

      if (first.startTime < second.endTime && second.startTime < first.endTime) {
        overlaps.push({
          start: first.startTime > second.startTime ? first.startTime : second.startTime,
          end: first.endTime < second.endTime ? first.endTime : second.endTime,
          ids: [first.id, second.id],
        })
      }
    }
  }

  return overlaps
}

export default function Itinerary() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [trips, setTrips] = useState([])
  const [activities, setActivities] = useState([])
  const [day, setDay] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [reviewing, setReviewing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const tripList = await getAllTrips()
      const activityList = await getAllActivities()

      setTrips(tripList)
      setActivities(activityList)
      setLoading(false)
    }

    load()
  }, [])

  // The trip comes from the URL (?tripId=1) so Trip Details can link straight to it.
  const selectedTripId = searchParams.get('tripId') || (trips[0] ? String(trips[0].id) : '')
  const trip = trips.find((item) => String(item.id) === selectedTripId)
  const tripActivities = activities.filter((activity) => String(activity.tripId) === selectedTripId)

  // Enough days for the trip dates, and never fewer than the days the activities use.
  const totalDays = trip
    ? Math.max(countDays(trip.startDate, trip.endDate), ...tripActivities.map((activity) => activity.day), 1)
    : 1

  const dayActivities = tripActivities
    .filter((activity) => activity.day === day)
    .sort((first, second) => first.startTime.localeCompare(second.startTime))

  const overlaps = findOverlaps(dayActivities)
  const overlapIds = overlaps.flatMap((overlap) => overlap.ids)

  function selectTrip(id) {
    setSearchParams({ tripId: id })
    setDay(1)
    setReviewing(false)
    setFormOpen(false)
    setEditing(null)
  }

  function selectDay(value) {
    setDay(value)
    setReviewing(false)
  }

  function openAddForm() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEditForm(activity) {
    setEditing(activity)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  function saveActivity(values) {
    if (editing) {
      setActivities((current) =>
        current.map((activity) => (activity.id === editing.id ? { ...activity, ...values } : activity))
      )
    } else {
      const nextId = activities.reduce((max, activity) => Math.max(max, activity.id), 0) + 1
      setActivities((current) => [...current, { id: nextId, tripId: trip.id, day, lat: null, lng: null, ...values }])
    }

    closeForm()
  }

  function deleteActivity(activity) {
    if (window.confirm(`Delete "${activity.name}"?`)) {
      setActivities((current) => current.filter((item) => item.id !== activity.id))
    }
  }

  if (loading) {
    return <p className={styles.loading}>Loading itinerary...</p>
  }

  if (!trip) {
    return (
      <div className={styles.page}>
        <p className={styles.note}>
          There are no trips yet. <Link to='/trips'>Go to My Trips</Link>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Itinerary Planner</h2>
          <p className={styles.subtitle}>Plan your days, your way.</p>
        </div>

        <div className={styles.tripPicker}>
          <span className={styles.pickerLabel}>Choose Trip</span>
          <select
            className={styles.select}
            value={selectedTripId}
            onChange={(event) => selectTrip(event.target.value)}
          >
            {trips.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.dayRow}>
        <DaySelector totalDays={totalDays} selectedDay={day} onSelect={selectDay} />

        <button type='button' className={styles.addButton} onClick={openAddForm}>
          + Add Activity
        </button>
      </div>

      {overlaps.length > 0 && (
        <div className={styles.warning}>
          <i className={`fa-solid fa-triangle-exclamation ${styles.warningIcon}`} aria-hidden='true' />
          <p className={styles.warningText}>
            {to12Hour(overlaps[0].start)} - {to12Hour(overlaps[0].end)} is partially overlapping with another
            activity.
            {overlaps.length > 1 ? ` ${overlaps.length} overlapping pairs on this day.` : ''}
          </p>
          <button type='button' className={styles.reviewButton} onClick={() => setReviewing(!reviewing)}>
            {reviewing ? 'Hide' : 'Review'}
          </button>
        </div>
      )}

      {formOpen && (
        <div className={styles.formWrap}>
          <ActivityForm activity={editing} onSave={saveActivity} onCancel={closeForm} />
        </div>
      )}

      <div className={styles.timelineWrap}>
        <ActivityTimeline
          activities={dayActivities}
          overlapIds={reviewing ? overlapIds : []}
          onEdit={openEditForm}
          onDelete={deleteActivity}
        />
      </div>

      <button type='button' className={styles.bottomAdd} onClick={openAddForm}>
        + Add Activity
      </button>

      <p className={styles.note}>
        Adding, editing and deleting here only changes this page. activityService still has getAll and getById, so
        reloading brings the mock data back.
      </p>
    </div>
  )
}
