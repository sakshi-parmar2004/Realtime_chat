import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Profile from './pages/Profile'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore'
import SettingsPage from './pages/Settings'


const App = () => {
  const {user, checkAuth , isCheckingAuth} = useAuthStore();
  const {theme} =useThemeStore();
  //it ensures that the checkAuth function is called only once when the component mounts
  //and not on every render. This is important for performance and to avoid unnecessary API calls.
  useEffect(() => {
    checkAuth();
 } , [checkAuth]);

 console.log( "user data check friom app",user);
 if(isCheckingAuth && !user)
{
  return (
 
    
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
    <h1 className=' text-center'>Loading...</h1>
      <Loader className="animate-spin  " />
   </div>


  )
}

  return (
    <div data-theme={theme}>
     <Toaster />
    <Navbar/>
    <Routes>
     <Route path='/' element={user?<HomePage/>: <Navigate  to="/login"/>}/>
     <Route path='/login' element={!user? <LoginPage/>: <Navigate to="/"/>}/>
     <Route path='/signup' element={!user? <SignupPage/>: <Navigate to="/"/>}/>
     <Route path='/settings' element={<SettingsPage/>}/>
     <Route path='/profile' element={user?<Profile/> : <Navigate  to="/login"/>}/>
    </Routes>
      
    </div>
  )
}

export default App
