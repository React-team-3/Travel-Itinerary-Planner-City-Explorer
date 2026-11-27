import styles from './ProfileCard.module.css'

export default function ProfileCard({ user }) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?'

  const details = [
    { label: 'Date of Birth', value: user?.dateOfBirth },
    { label: 'Gender', value: user?.gender },
    { label: 'Address', value: user?.address },
    { label: 'City', value: user?.city },
    { label: 'Country', value: user?.country },
    { label: 'Time Zone', value: user?.timezone },
    { label: 'Language', value: user?.language },
    { label: 'Currency', value: user?.preferredCurrency },
    { label: 'Travel Style', value: user?.travelStyle },
  ]

  return (
    <div className={styles.ProfileCard}>
      <div className={styles.header}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>{initial}</div>
        )}
        <div>
          <h3 className={styles.name}>{user?.name}</h3>
          <p className={styles.email}>{user?.email}</p>
        </div>
      </div>

      <div className={styles.details}>
        {details.map((item) => (
          <div key={item.label} className={styles.row}>
            <span className={styles.label}>{item.label}</span>
            <span>{item.value || 'Not set'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}