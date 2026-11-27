import * as Yup from 'yup'
import { useState } from 'react'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../routes/routePaths'
import { resetPassword } from '../../services/authService'
import styles from './ForgotPassword.module.css'

export default function ForgotPassword() {
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Step 1: email
  const emailSchema = Yup.object({
    email: Yup.string().required('Email is required').email('Enter a valid email'),
  })

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      const users = JSON.parse(localStorage.getItem('tripcraft_users') || '[]')
      const userExists = users.find(
        (user) => user.email.toLowerCase() === values.email.toLowerCase()
      )
      if (!userExists) {
        setError('This email is not registered')
        return
      }
      setError('')
      setVerifiedEmail(values.email)
    },
  })

  // Step 2: new password
  const passwordSchema = Yup.object({
    password: Yup.string().required('Password is required').min(6, 'Min length is 6'),
    rePassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),
  })

  const resetFormik = useFormik({
    initialValues: { password: '', rePassword: '' },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      resetPassword(verifiedEmail, values.password)
        .then(() => {
          setSuccess(true)
        })
        .catch((err) => {
          setError(err.message || 'Something went wrong')
        })
    },
  })

  return (
    <div className={styles.ForgotPassword}>
      <div className={styles.card}>
        {success ? (
          <div>
            <h2 className={styles.title}>Password Updated</h2>
            <div className='alert alert-success mt-3'>
              Your password has been reset successfully.
            </div>
            <Link to={ROUTES.LOGIN} className={`btn w-100 text-white ${styles.button}`}>
              Go to Login
            </Link>
          </div>
        ) : null}
        {!success && verifiedEmail ? (
          <div>
            <h2 className={styles.title}>Reset Password</h2>
            <p className={styles.subtitle}>Choose a new password for {verifiedEmail}</p>

            {error ? <div className='text-danger mb-3'>{error}</div> : null}

            <form onSubmit={resetFormik.handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='password' className='form-label'>New Password</label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  className={`form-control ${resetFormik.touched.password && resetFormik.errors.password ? 'is-invalid' : ''}`}
                  value={resetFormik.values.password}
                  onChange={resetFormik.handleChange}
                  onBlur={resetFormik.handleBlur}
                />
                {resetFormik.touched.password && resetFormik.errors.password ? (
                  <div className='text-danger'>{resetFormik.errors.password}</div>
                ) : null}
              </div>

              <div className='mb-3'>
                <label htmlFor='rePassword' className='form-label'>Confirm Password</label>
                <input
                  type='password'
                  id='rePassword'
                  name='rePassword'
                  className={`form-control ${resetFormik.touched.rePassword && resetFormik.errors.rePassword ? 'is-invalid' : ''}`}
                  value={resetFormik.values.rePassword}
                  onChange={resetFormik.handleChange}
                  onBlur={resetFormik.handleBlur}
                />
                {resetFormik.touched.rePassword && resetFormik.errors.rePassword ? (
                  <div className='text-danger'>{resetFormik.errors.rePassword}</div>
                ) : null}
              </div>

              <button type='submit' className={`btn w-100 text-white ${styles.button}`}>
                Reset Password
              </button>
            </form>
          </div>
        ) : null}
       {!success && !verifiedEmail ? (
          <div>
            <h2 className={styles.title}>Forgot Password?</h2>
            <p className={styles.subtitle}>
              Don't worry! Enter your email address and we'll help you reset your password.
            </p>

            <form onSubmit={formik.handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='email' className='form-label'>Email Address</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                  placeholder='Enter your email'
                  value={formik.values.email}
                  onChange={(e) => {
                    setError('')
                    formik.handleChange(e)
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className='text-danger'>{formik.errors.email}</div>
                ) : null}
                {error ? <div className='text-danger mt-2'>{error}</div> : null}
              </div>

              <button type='submit' className={`btn w-100 text-white ${styles.button}`}>
                Continue
              </button>
            </form>
          </div>
        ) : null}

        <p className='mt-4 text-center'>
          <Link to={ROUTES.LOGIN}>Back to Login</Link>
        </p>
      </div>
    </div>
  )
}