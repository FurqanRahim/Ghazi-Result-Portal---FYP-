import React, { useState } from 'react'
import {  Route, Routes } from 'react-router-dom'
import PageNotFound from '../Admindashboard/PageNotFound'
// import TakeAttendance from '../TeacherDashboard/TakeAttendance'
import Sidebar from './partials/Sidebar'
import Header from './partials/Header'
import Overview from '../TeacherDashboard/OverView'
import Footer from '../Admindashboard/Footer'
import Logout from '../TeacherDashboard/Logout'
import TeacherCourses from '../TeacherDashboard/TeacherCourses'
import CResult from '../TeacherDashboard/CResult'
import ViewResult from '../TeacherDashboard/ViewResult'


const TeacherDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get stored user info
  const teacherId = user && user.role === "teacher" ? user._id : null;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
     <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
           
            {/* <Path /> */}
            <Routes>
              
              <Route
                    path="/"
                    element={
                        
                            <Overview />
                        
                    }
                />
     <Route path="view-courses" element={<TeacherCourses teacherId = {teacherId} />} />
     <Route path="create-result" element={<CResult teacherId = {teacherId} />} />
     
     <Route path="view-result" element={<ViewResult teacherId = {teacherId} />} />
      <Route path="logout" element={<Logout />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          
            <div className='mt-4'>
            <Footer />
            </div>
            
          </div>
        </main>
      </div>
    </div>
    </>
    
  )
}

export default TeacherDashboard
