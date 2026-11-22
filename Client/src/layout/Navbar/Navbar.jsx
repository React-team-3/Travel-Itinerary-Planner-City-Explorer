import React from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../routes/routePaths'

export default function Navbar() {
  return (
    <nav className='bg-dark px-3 py-2 d-flex justify-content-between align-items-center'>
      <NavLink to={ROUTES.HOME} className='text-white text-decoration-none fw-bold'>
        TripCraft
      </NavLink>
      <ul className='d-flex list-unstyled m-0'>
        <li><NavLink to={ROUTES.NOTIFICATIONS} className='text-white text-decoration-none p-2'>Notifications</NavLink></li>
        <li><NavLink to={ROUTES.PROFILE} className='text-white text-decoration-none p-2'>Profile</NavLink></li>
        <li><NavLink to={ROUTES.LOGIN} className='text-white text-decoration-none p-2'>Login</NavLink></li>
        <li><NavLink to={ROUTES.REGISTER} className='text-white text-decoration-none p-2'>Register</NavLink></li>
      </ul>
    </nav>
  )
}
