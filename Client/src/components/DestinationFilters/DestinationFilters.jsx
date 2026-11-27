import React from 'react'
import styles from './DestinationFilters.module.css'

const PRICE_LEVELS = [
  { value: '$', label: '$ (Budget)' },
  { value: '$$', label: '$$ (Moderate)' },
  { value: '$$$', label: '$$$ (Upscale)' },
  { value: '$$$$', label: '$$$$ (Luxury)' },
]

export default function DestinationFilters({
  countries = [],
  tags = [],
  selectedCountry = '',
  selectedPrice = '',
  selectedTag = '',
  onCountryChange,
  onPriceChange,
  onTagChange,
  onReset,
}) {
  const hasActiveFilters = Boolean(selectedCountry || selectedPrice || selectedTag)

  return (
    <div className={styles.filters}>
      <div className={styles.group}>
        <label htmlFor="country-filter" className={styles.label}>
          Country
        </label>
        <select
          id="country-filter"
          className={styles.select}
          value={selectedCountry}
          onChange={(e) => onCountryChange && onCountryChange(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label htmlFor="price-filter" className={styles.label}>
          Budget
        </label>
        <select
          id="price-filter"
          className={styles.select}
          value={selectedPrice}
          onChange={(e) => onPriceChange && onPriceChange(e.target.value)}
        >
          <option value="">All Budgets</option>
          {PRICE_LEVELS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label htmlFor="tag-filter" className={styles.label}>
          Travel Style
        </label>
        <select
          id="tag-filter"
          className={styles.select}
          value={selectedTag}
          onChange={(e) => onTagChange && onTagChange(e.target.value)}
        >
          <option value="">All Styles</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className={styles.resetBtn}
          onClick={() => onReset && onReset()}
        >
          Reset Filters
        </button>
      )}
    </div>
  )
}
