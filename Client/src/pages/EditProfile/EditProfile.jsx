import  { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/routePaths'
import { useAuth } from '../../context/AuthContext'
import styles from './EditProfile.module.css'

export default function EditProfile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [photoError, setPhotoError] = useState('')

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      setPhotoError('Image must be smaller than 1MB')
      return
    }

    setPhotoError('')
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleRemovePhoto() {
    setAvatar('')
    setPhotoError('')
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('name is required').min(3, 'min length is 3'),
    email: Yup.string().required('email is required').email('enter valid email'),
  })

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      timezone: user?.timezone || '',
      language: user?.language || 'English',
      preferredCurrency: user?.preferredCurrency || 'USD',
      travelStyle: user?.travelStyle || '',
      receiveInspiration: user?.receiveInspiration ?? true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateUser({ ...values, avatar: avatar })
      navigate(ROUTES.PROFILE)
    },
  })

  if (!user) {
    return (
      <div className={styles.EditProfile}>
        <p>You are not logged in.</p>
      </div>
    )
  }

  return (
     <div className={styles.EditProfile}>
      <div className={styles.content}>
      <h2 className={styles.title}>Edit Profile</h2>
      <p className={styles.subtitle}>Manage your account and travel preferences</p>
      <form onSubmit={formik.handleSubmit}>
        <div className='row g-3'>
          {/* Profile Picture */}
                   {/* Profile Picture */}
          <div className='col-12 col-lg-4'>
            <div className={styles.card}>
              <h5 className={styles.cardTitle}>Profile Picture</h5>
              <div className={styles.avatarWrapper}>
                {avatar ? (
                  <img src={avatar} alt={user.name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarFallback}>
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>

              <div className={styles.photoButtons}>
                <label htmlFor='photo' className={styles.changePhoto}>Change Photo</label>
                {avatar ? (
                  <button type='button' className={styles.removePhoto} onClick={handleRemovePhoto}>
                    Remove
                  </button>
                ) : null}
                <input id='photo' type='file' accept='image/*' hidden onChange={handlePhotoChange} />
              </div>

              {photoError ? <div className='text-danger text-center mt-2'>{photoError}</div> : null}
            </div>
          </div>
          <div className='col-12 col-lg-8'>
            <div className={styles.card}>
              <h5 className={styles.cardTitle}>Account Details</h5>

              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>Full Name</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className='text-danger'>{formik.errors.name}</div>
                ) : null}
              </div>

              <div className='row'>
                <div className='col-12 col-md-6 mb-3'>
                  <label htmlFor='email' className='form-label'>Email</label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className='text-danger'>{formik.errors.email}</div>
                  ) : null}
                </div>

                <div className='col-12 col-md-6 mb-3'>
                  <label htmlFor='dateOfBirth' className='form-label'>Date of Birth</label>
                  <input
                    type='date'
                    id='dateOfBirth'
                    name='dateOfBirth'
                    className='form-control'
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <div className='mb-1'>
                <label htmlFor='gender' className='form-label'>Gender</label>
                <select
                  id='gender'
                  name='gender'
                  className='form-select'
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <option value=''>Select</option>
                  <option value='Female'>Female</option>
                  <option value='Male'>Male</option>
                </select>
              </div>
            </div>
          </div>
          <div className='col-12'>
            <div className={styles.card}>
              <h5 className={styles.cardTitle}>Location & Travel Style</h5>
              <div className='row'>
                <div className='col-12 col-md-4 mb-3'>
                  <label htmlFor='address' className='form-label'>Address</label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    className='form-control'
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className='col-12 col-md-4 mb-3'>
                  <label htmlFor='city' className='form-label'>City</label>
                  <input
                    type='text'
                    id='city'
                    name='city'
                    className='form-control'
                    value={formik.values.city}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className='col-12 col-md-4 mb-3'>
                  <label htmlFor='country' className='form-label'>Country</label>
                  <input
                    type='text'
                    id='country'
                    name='country'
                    className='form-control'
                    value={formik.values.country}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <div className='mb-1'>
                <label htmlFor='timezone' className='form-label'>Time Zone</label>
                <input
                  type='text'
                  id='timezone'
                  name='timezone'
                  className='form-control'
                  placeholder='e.g. (UTC+2) Cairo'
                  value={formik.values.timezone}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-4'>
            <div className={styles.card}>
              <h5 className={styles.cardTitle}>Preferences</h5>

              <div className='mb-3'>
                <label htmlFor='language' className='form-label'>Language</label>
                <select
                  id='language'
                  name='language'
                  className='form-select'
                  value={formik.values.language}
                  onChange={formik.handleChange}
                >
                  <option value='English'>English</option>
                  <option value='Arabic'>Arabic</option>
                </select>
              </div>

              <div className='mb-3'>
                <label htmlFor='preferredCurrency' className='form-label'>Currency</label>
                <select
                  id='preferredCurrency'
                  name='preferredCurrency'
                  className='form-select'
                  value={formik.values.preferredCurrency}
                  onChange={formik.handleChange}
                >
                  <option value='USD'>USD - US Dollar</option>
                  <option value='EUR'>EUR - Euro</option>
                  <option value='EGP'>EGP - Egyptian Pound</option>
                </select>
              </div>

              <div className='mb-3'>
                <label htmlFor='travelStyle' className='form-label'>Travel Style</label>
                <select
                  id='travelStyle'
                  name='travelStyle'
                  className='form-select'
                  value={formik.values.travelStyle}
                  onChange={formik.handleChange}
                >
                  <option value=''>Select</option>
                  <option value='Beach & Relaxation'>Beach & Relaxation</option>
                  <option value='Adventure'>Adventure</option>
                  <option value='City & Culture'>City & Culture</option>
                  <option value='History'>History</option>
                </select>
              </div>

              <div className='form-check form-switch'>
                <input
                  type='checkbox'
                  id='receiveInspiration'
                  name='receiveInspiration'
                  className='form-check-input'
                  checked={formik.values.receiveInspiration}
                  onChange={formik.handleChange}
                />
                <label htmlFor='receiveInspiration' className='form-check-label'>
                  Receive travel inspiration
                </label>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-8'>
            <div className={styles.buttons}>
              <button type='submit' className={`btn text-white ${styles.saveButton}`}>
                Save Changes
              </button>
              <button
                type='button'
                className={`btn btn-light ${styles.cancelButton}`}
                onClick={() => navigate(ROUTES.PROFILE)}
              >
                Cancel
              </button>
            </div>

            <button
              type='button'
              className={styles.logoutCard}
              onClick={() => {
                logout()
                navigate(ROUTES.LOGIN)
              }}
            >
              <div>
                <strong>Log out</strong>
                <div className={styles.logoutText}>Sign out of your account</div>
              </div>
              <span>→</span>
            </button>
          </div>
        </div>
      </form>
    </div>
    </div>
  )

}