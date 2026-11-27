import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../routes/routePaths'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN)
  }

  if (!user) {
    return (
      <div className={styles.Profile}>
        <p>You are not logged in.</p>
        <Link to={ROUTES.LOGIN}>Login</Link>
      </div>
    )
  }

  return (
    <div className={styles.Profile}>
      <div className={styles.content}>
        <div className={styles.top}>
          <h2 className={styles.title}>Profile</h2>
          <div className={styles.actions}>
            <button
              className={`btn text-white ${styles.editButton}`}
              onClick={() => navigate(ROUTES.EDIT_PROFILE)}
            >
              Edit Profile
            </button>
            <button className={`btn btn-light ${styles.logoutButton}`} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <ProfileCard user={user} />
      </div>
    </div>
  )
}