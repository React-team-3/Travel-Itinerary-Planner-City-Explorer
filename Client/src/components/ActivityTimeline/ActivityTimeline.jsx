import React from 'react'
import ActivityCard from '../ActivityCard/ActivityCard'
import styles from './ActivityTimeline.module.css'

// The activities of one day, already sorted by start time.
export default function ActivityTimeline({ activities, overlapIds, onEdit, onDelete }) {
  if (activities.length === 0) {
    return <p className={styles.empty}>Nothing planned for this day yet. Use "Add Activity" to add the first one.</p>
  }

  return (
    <div className={styles.timeline}>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          overlap={overlapIds.includes(activity.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}