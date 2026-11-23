import React from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../routes/routePaths'

export default function Sidebar() {
  return (
    <aside className='bg-dark-subtle p-3' style={{ minWidth: '220px' }}>
      <ul className='list-unstyled m-0'>
        <li><NavLink to={ROUTES.DASHBOARD} className='d-block p-2 text-decoration-none'>Dashboard</NavLink></li>
        <li><NavLink to={ROUTES.AI_GENERATOR} className='d-block p-2 text-decoration-none'>AI Generator</NavLink></li>
        <li><NavLink to={ROUTES.TRIPS} className='d-block p-2 text-decoration-none'>My Trips</NavLink></li>
        <li><NavLink to={ROUTES.ITINERARY} className='d-block p-2 text-decoration-none'>Itinerary</NavLink></li>
        <li><NavLink to={ROUTES.DESTINATIONS} className='d-block p-2 text-decoration-none'>Discover</NavLink></li>
        <li><NavLink to={ROUTES.FAVORITES} className='d-block p-2 text-decoration-none'>Favorites</NavLink></li>
        <li><NavLink to={ROUTES.MAP} className='d-block p-2 text-decoration-none'>Map</NavLink></li>
        <li><NavLink to={ROUTES.WEATHER} className='d-block p-2 text-decoration-none'>Weather</NavLink></li>
        <li><NavLink to={ROUTES.BUDGET} className='d-block p-2 text-decoration-none'>Budget</NavLink></li>
        <li><NavLink to={ROUTES.EXPENSES} className='d-block p-2 text-decoration-none'>Expenses</NavLink></li>
      </ul>
    </aside>
  )
}
