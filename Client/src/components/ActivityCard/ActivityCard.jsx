import React from 'react'
import styles from './ActivityCard.module.css'

// "09:30" -> "9:30 AM"
function to12Hour(time) {
  const [hour, minute] = time.split(':').map(Number)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`
}

// 09:00 - 13:00 -> "4h"
function durationLabel(startTime, endTime) {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}

// One row of the day timeline: time on the left, the activity card next to it.
export default function ActivityCard({ activity, overlap, onEdit, onDelete }) {
  return (
    <div className={styles.row}>
      <div className={styles.time}>{to12Hour(activity.startTime)}</div>

      <div className={styles.line}>
        <span className={styles.dot} />
      </div>

      <div className={`${styles.card} ${overlap ? styles.overlap : ''}`}>
        <span className={styles.icon}>
          <i className='fa-solid fa-location-dot' aria-hidden='true' />
        </span>

        <div className={styles.info}>
          <h6 className={styles.name}>{activity.name}</h6>
          <p className={styles.place}>{activity.place}</p>

          <div className={styles.actions}>
            <button type='button' className={styles.link} onClick={() => onEdit(activity)}>
              <i className='fa-solid fa-pen' aria-hidden='true' /> Edit
            </button>
            <button type='button' className={`${styles.link} ${styles.deleteLink}`} onClick={() => onDelete(activity)}>
              <i className='fa-solid fa-trash-can' aria-hidden='true' /> Delete
            </button>
          </div>
        </div>

        <span className={styles.duration}>{durationLabel(activity.startTime, activity.endTime)}</span>
      </div>
    </div>
  )
}

