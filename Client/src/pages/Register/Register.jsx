import { useState } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import * as Yup from 'yup'
import { ROUTES } from '../../routes/routePaths'
import { register } from '../../services/authService'
import styles from './Register.module.css'
import { useFormik } from 'formik'

export default function Register() {
  const [apiError,setError]=useState('')
  const navigate=useNavigate()
function handleRegister(formData) {
  register(formData)
    .then(()=>{
      navigate(ROUTES.LOGIN)
    })
    .catch((error)=>{
      setError(error.response?.data?.message || error.message || 'Something went wrong')
    })
}
const validationSchema=Yup.object({
  name: Yup.string().required('name is required').min(3, 'min length is 3'),
  email: Yup.string().required('email is required').email('enter valid email'),
  password: Yup.string().required('password is required').min(6, 'min length is 6'),
  rePassword: Yup.string().required('confirm password is required').oneOf([Yup.ref('password')], 'passwords do not match'),
})
const formik=useFormik({
  initialValues: { 
    name: '',
    email: '', 
    password: '', 
    rePassword: '' 
  },
  validationSchema: validationSchema,
  onSubmit: handleRegister,
})
  return (
     <div className={styles.Register}>
      <div className={styles.card}>
      <h2 className={styles.title}>Create Account</h2>
      <p className={styles.subtitle}>Start planning your trips with TripCraft</p>      {
        apiError? <div className='bg-danger-subtle rounded-3 p-2 mb-3'>{apiError}</div> : null
      }
      <form onSubmit={formik.handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>Full Name</label>
          <input type='text' id='name' name='name' className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`} value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
          {
          formik.touched.name && formik.errors.name?(<div className='text-danger'>{formik.errors.name}</div>)
           : null
           }
        </div>
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
          <input type='password' id='password' name='password' className={`form-control ${formik.touched.password && formik.errors.password ?'is-invalid':''}`} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
          {
          formik.touched.password && formik.errors.password?(<div className='text-danger'>{formik.errors.password}</div>)
          :null
          }
        </div>
        <div className='mb-3'>
          <label htmlFor='rePassword' className='form-label'>Confirm Password</label>
          <input type='password' id='rePassword' name='rePassword' className={`form-control ${formik.touched.rePassword && formik.errors.rePassword ?'is-invalid':''}`} value={formik.values.rePassword} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
          {
          formik.touched.rePassword && formik.errors.rePassword?(<div className='text-danger'>{formik.errors.rePassword}</div>)
          :null
          }
        </div>
         <button type='submit' className={`btn w-100 text-white ${styles.button}`}>Create Account</button>
     </form>
     <p className='mt-3 text-center'>Already have an account?<Link to={ROUTES.LOGIN}>Login</Link></p>
  </div>
   </div>   
)
}



