import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routePaths'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layout/DashboardLayout/DashboardLayout'
import NotFound from '../pages/NotFound/NotFound'
import Welcome from '../pages/Welcome/Welcome'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import Dashboard from '../pages/Dashboard/Dashboard'
import Profile from '../pages/Profile/Profile'
import EditProfile from '../pages/EditProfile/EditProfile'
import Notifications from '../pages/Notifications/Notifications'
import AIGenerator from '../pages/AIGenerator/AIGenerator'
import GeneratedPlan from '../pages/GeneratedPlan/GeneratedPlan'
import ConfirmGeneratedTrip from '../pages/ConfirmGeneratedTrip/ConfirmGeneratedTrip'
import MyTrips from '../pages/MyTrips/MyTrips'
import CreateTrip from '../pages/CreateTrip/CreateTrip'
import TripDetails from '../pages/TripDetails/TripDetails'
import EditTrip from '../pages/EditTrip/EditTrip'
import Itinerary from '../pages/Itinerary/Itinerary'
import DiscoverDestinations from '../pages/DiscoverDestinations/DiscoverDestinations'
import DestinationDetails from '../pages/DestinationDetails/DestinationDetails'
import CompareDestinations from '../pages/CompareDestinations/CompareDestinations'
import Favorites from '../pages/Favorites/Favorites'
import TripMap from '../pages/TripMap/TripMap'
import Weather from '../pages/Weather/Weather'
import BudgetOverview from '../pages/BudgetOverview/BudgetOverview'
import Expenses from '../pages/Expenses/Expenses'

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <Welcome /> },
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.REGISTER, element: <Register /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  {
    path: '',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: <Dashboard /> },
      { path: ROUTES.PROFILE, element: <Profile /> },
      { path: ROUTES.EDIT_PROFILE, element: <EditProfile /> },
      { path: ROUTES.NOTIFICATIONS, element: <Notifications /> },
      { path: ROUTES.AI_GENERATOR, element: <AIGenerator /> },
      { path: ROUTES.GENERATED_PLAN, element: <GeneratedPlan /> },
      { path: ROUTES.CONFIRM_TRIP, element: <ConfirmGeneratedTrip /> },
      { path: ROUTES.TRIPS, element: <MyTrips /> },
      { path: ROUTES.CREATE_TRIP, element: <CreateTrip /> },
      { path: ROUTES.TRIP_DETAILS, element: <TripDetails /> },
      { path: ROUTES.EDIT_TRIP, element: <EditTrip /> },
      { path: ROUTES.ITINERARY, element: <Itinerary /> },
      { path: ROUTES.DESTINATIONS, element: <DiscoverDestinations /> },
      { path: ROUTES.DESTINATION_DETAILS, element: <DestinationDetails /> },
      { path: ROUTES.COMPARE, element: <CompareDestinations /> },
      { path: ROUTES.FAVORITES, element: <Favorites /> },
      { path: ROUTES.MAP, element: <TripMap /> },
      { path: ROUTES.WEATHER, element: <Weather /> },
      { path: ROUTES.BUDGET, element: <BudgetOverview /> },
      { path: ROUTES.EXPENSES, element: <Expenses /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
