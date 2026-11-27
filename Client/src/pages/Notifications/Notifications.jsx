import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAll,
} from '../../services/notificationService'
import formatDate from '../../utils/formatDate'
import styles from './Notifications.module.css'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const icons = {
    flight: 'fa-plane',
    hotel: 'fa-hotel',
    trip: 'fa-circle-check',
    destination: 'fa-location-dot',
    inspiration: 'fa-heart',
  }

  useEffect(() => {
    getNotifications().then((data) => setNotifications(data))
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const visible = filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications
  function openNotification(item) {
    setSelected(item)
    if (!item.isRead) {
      markAsRead(item.id).then((data) => setNotifications(data))
    }
  }

  return (
    <div className={styles.Notifications}>
      <div className={styles.content}>
      <h2 className={styles.title}>Notifications</h2>
      <p className={styles.subtitle}>Stay updated on your trips and travel inspiration.</p>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            type='button'
            className={`${styles.tab} ${filter === 'all' ? styles.activeTab : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type='button'
            className={`${styles.tab} ${filter === 'unread' ? styles.activeTab : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className={styles.toolbarActions}>
          <button
            type='button'
            className={styles.markAll}
            onClick={() => markAllAsRead().then((data) => setNotifications(data))}
          >
            Mark all as read
          </button>
          <button
            type='button'
            className={styles.deleteAll}
            onClick={() => {
              if (window.confirm('Delete all notifications?')) {
                deleteAll().then((data) => setNotifications(data))
              }
            }}
          >
            Delete all
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {visible.length === 0 ? (
          <div className={styles.empty}>
            {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
          </div>
        ) : null}

        {visible.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${item.isRead ? '' : styles.unread}`}
          >
            <div className={styles.icon}>
              <i className={`fa-solid ${icons[item.type] || 'fa-bell'}`}></i>
            </div>

             <div className={styles.body}>
              <div className={styles.clickable} onClick={() => openNotification(item)}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.message}>{item.message}</div>
              </div>
              {item.link ? (
                <Link to={item.link} className={styles.link}>{item.linkText}</Link>
              ) : null}
            </div>

            <div className={styles.side}>
              <span className={styles.date}>{formatDate(item.date)}</span>
              <div className={styles.itemActions}>
                {item.isRead ? null : (
                  <button
                    type='button'
                    className={styles.markRead}
                    onClick={() => markAsRead(item.id).then((data) => setNotifications(data))}
                  >
                    Mark as read
                  </button>
                )}
                <button
                  type='button'
                  className={styles.delete}
                  aria-label='Delete notification'
                  onClick={() => deleteNotification(item.id).then((data) => setNotifications(data))}
                >
                  <i className='fa-solid fa-trash'></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
            {selected ? (
        <div className={styles.overlay}>
          <div className={styles.backdrop} onClick={() => setSelected(null)}></div>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <i className={`fa-solid ${icons[selected.type] || 'fa-bell'}`}></i>
            </div>
            <h4 className={styles.modalTitle}>{selected.title}</h4>
            <div className={styles.modalDate}>{formatDate(selected.date)}</div>
            <p className={styles.modalMessage}>{selected.message}</p>

            <div className={styles.modalActions}>
              {selected.link ? (
                <Link to={selected.link} className={styles.modalLink}>{selected.linkText}</Link>
              ) : null}
              <button
                type='button'
                className={styles.modalDelete}
                onClick={() =>
                  deleteNotification(selected.id).then((data) => {
                    setNotifications(data)
                    setSelected(null)
                  })
                }
              >
                Delete
              </button>
              <button type='button' className={styles.modalClose} onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}