import React from 'react'
import styles from './SearchBar.module.css'

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search by city, country, or style...',
}) {
  const handleClear = () => {
    if (onChange) {
      onChange('')
    }
  }

  return (
    <div className={styles.searchBar}>
      <span className={styles.icon} aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search destinations"
      />

      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}