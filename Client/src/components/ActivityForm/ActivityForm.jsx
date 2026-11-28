import React, { useState } from 'react'
import styles from './ActivityForm.module.css'

const emptyActivity = { name: '', place: '', startTime: '09:00', endTime: '10:00' }

// Small form used to add a new activity or to edit an existing one.
export default function ActivityForm({ activity, onSave, onCancel }) {
  const [values, setValues] = useState(
    activity
      ? {
          name: activity.name,
          place: activity.place,
          startTime: activity.startTime,
          endTime: activity.endTime,
        }
      : emptyActivity
  )
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!values.name.trim() || !values.place.trim()) {
      setError('Name and place are required.')
      return
    }

    if (values.endTime <= values.startTime) {
      setError('The end time has to be after the start time.')
      return
    }

    onSave({
      name: values.name.trim(),
      place: values.place.trim(),
      startTime: values.startTime,
      endTime: values.endTime,
    })
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h6 className={styles.title}>{activity ? 'Edit activity' : 'New activity'}</h6>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            className={styles.input}
            name='name'
            value={values.name}
            onChange={handleChange}
            placeholder='Louvre Museum'
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Place</span>
          <input
            className={styles.input}
            name='place'
            value={values.place}
            onChange={handleChange}
            placeholder='Rue de Rivoli'
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Start time</span>
          <input
            className={styles.input}
            name='startTime'
            type='time'
            value={values.startTime}
            onChange={handleChange}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>End time</span>
          <input
            className={styles.input}
            name='endTime'
            type='time'
            value={values.endTime}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button type='submit' className={styles.saveButton}>
          {activity ? 'Save changes' : 'Add activity'}
        </button>
        <button type='button' className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}