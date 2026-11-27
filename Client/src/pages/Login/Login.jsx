import { useState } from 'react'
import { useNavigate , Link} from 'react-router-dom'
import * as Yup from 'yup' 
import styles from './Login.module.css'
import { ROUTES } from '../../routes/routePaths'
import { useAuth } from '../../context/AuthContext' 
import { login } from '../../services/authService'
import { useFormik } from 'formik'
export default function Login() {
  const [apiError,setError]=useState('')
  const navigate=useNavigate()
  const auth=useAuth()
  function handleLogin(formData) {
    login(formData.email , formData.password)
      .then((user)=>{
        auth.login(user, formData.rememberMe)
        navigate(ROUTES.DASHBOARD)
      })
      .catch((error)=>{
             setError(error.response?.data?.message || error.message || 'Something went wrong')

      })
  }

 const validationSchema=Yup.object({
   email: Yup.string().required('email is required').email('enter valid email'),
   password: Yup.string().required('password is required').min(6, 'min length is 6'),
   })

   const formik=useFormik({
     initialValues: { 
       email: '', 
       password: '',
       rememberMe:false  
      },
     validationSchema: validationSchema,
     onSubmit:handleLogin,
   })
  return (
    <div className={styles.Login}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Login to continue planning your trips</p>
        {
        apiError?<div className='bg-danger-subtle rounded-3 p-2 mb-3'>{apiError}</div>
        :null
        }
       <form onSubmit={formik.handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>Email</label>
            <input type='email' id='email' name='email' className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`} value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            {
            formik.touched.email && formik.errors.email?(<div className='text-danger'>{formik.errors.email}</div>)
           :null
           }
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>Password</label>
            <input type='password' id='password' name='password' className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            {
            formik.touched.password && formik.errors.password?(<div className='text-danger'>{formik.errors.password}</div>)
            :null
            }
          </div>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <div className='form-check'>
              <input type='checkbox' id='rememberMe' name='rememberMe' className='form-check-input' checked={formik.values.rememberMe} onChange={formik.handleChange}/>
              <label htmlFor='rememberMe' className='form-check-label'>Remember me</label>
            </div>
            <Link to={ROUTES.FORGOT_PASSWORD}>Forgot password?</Link>
          </div>
          <button type='submit' className={`btn w-100 text-white ${styles.button}`}>Login</button>
        </form>
        <p className='mt-3 text-center'> Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link></p>
      </div>
    </div>
  )
}
