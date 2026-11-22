import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../Footer/Footer'

export default function DashboardLayout() {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='d-flex flex-grow-1'>
        <Sidebar />
        <main className='flex-grow-1 p-3'>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
