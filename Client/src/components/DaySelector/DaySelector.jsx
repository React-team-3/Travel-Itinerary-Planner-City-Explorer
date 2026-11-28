import React from 'react'
import styles from './DaySelector.module.css'

// Day 1, Day 2, Day 3 ... as small tabs above the timeline.
export default function DaySelector({ totalDays, selectedDay, onSelect }) {
  const days = Array.from({ length: totalDays }, (_, index) => index + 1)

  return (
    <div className={styles.tabs}>
      {days.map((day) => (
        <button
          key={day}
          type='button'
          className={`${styles.tab} ${day === selectedDay ? styles.activeTab : ''}`}
          onClick={() => onSelect(day)}
        >
          Day {day}
        </button>
      ))}
    </div>
  )
}