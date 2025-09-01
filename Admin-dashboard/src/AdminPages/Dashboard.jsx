import React, { useState } from 'react';
import Sidebar from './partials/Sidebar';
import Header from './partials/Header';
// import FilterButton from '../components/DropdownFilter';
// import Datepicker from '../components/Datepicker';
import DashboardCard02 from '../Admindashboard/DashboardCard02';
// import Path from '../routes/Path'; // Ensure correct path to the component
import Footer from '../Admindashboard/Footer';
import CCLass from '../Admindashboard/CClass';
import ViewClass from '../Admindashboard/ViewClass';
import CCourse from '../Admindashboard/CCourse';
import ViewCourse from '../Admindashboard/ViewCourse';
import CStudent from '../Admindashboard/CStudent';
import ViewStudent from '../Admindashboard/ViewStudent';

import CTeacher from '../Admindashboard/CTeacher';
import ViewTeacher from '../Admindashboard/ViewTeacher';
import Logout from '../Admindashboard/Logout';
import Overview from '../Admindashboard/OverView';
import CEnrollment from '../Admindashboard/CEnrollment';
import ViewEnroll from '../Admindashboard/ViewEnroll';
import PageNotFound from '../Admindashboard/PageNotFound';
import { Route, Routes } from 'react-router-dom';
import EStudent from '../Admindashboard/EStudent';
import ETeacher from '../Admindashboard/ETeacher';
import UpdateClass from '../Admindashboard/EClass';
import UCourse from '../Admindashboard/ECourse';
import UEnrollment from '../Admindashboard/UEnrollment';
import CResult from '../Admindashboard/CResult';
import ViewResult from '../Admindashboard/ViewResult';
import StudentResult from '../Admindashboard/StudentResult';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            {/* <div className="sm:flex sm:justify-between sm:items-center mb-8"> */}
              {/* Left: Title */}
              {/* <div className="mb-4 sm:mb-0">
                <DashboardCard02 />
              </div> */}

              {/* Right: Actions */}
              {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <FilterButton align="right" />
                <Datepicker align="right" />
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                  <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="max-xs:sr-only">Add View</span>
                </button>
              </div> */}
            {/* </div> */}

            {/* Render Routes */}
            {/* <Path /> */}
            <Routes>
              <Route path="create-class" element={<CCLass />} />
              <Route path="edit-class/:id" element={<UpdateClass />} />
              <Route path="view-class" element={<ViewClass />} />
              <Route path="create-course" element={<CCourse />} />
              <Route path="edit-course/:id" element={<UCourse />} />
              <Route path="view-course" element={<ViewCourse />} />
              <Route path="view-student" element={<ViewStudent />} />
              <Route path="edit-student/:id" element={<EStudent />} />
              <Route path="create-student" element={<CStudent />} />
              <Route path="create-Teacher" element={<CTeacher />} />
              <Route path="edit-teacher/:id" element={<ETeacher />} />
              <Route path="view-Teacher" element={<ViewTeacher />} />
              <Route path="logout" element={<Logout />} />
              {/* <Route path="dashboard" element={<Overview />} /> */}
              <Route
                    path="/"
                    element={
                        
                            <Overview />
                        
                    }
                />
              <Route path="create-enrollment" element={<CEnrollment />} />
              <Route path="edit-enrollment/:id" element={<UEnrollment />} />
              <Route path="view-enroll" element={<ViewEnroll />} />

              <Route path="create-result" element={<CResult />} />
              <Route path="view-result" element={<ViewResult />} />
              <Route path="student-result" element={<StudentResult />} />
              {/* Add more routes as needed */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          
            <div className='mt-4'>
            <Footer />
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
