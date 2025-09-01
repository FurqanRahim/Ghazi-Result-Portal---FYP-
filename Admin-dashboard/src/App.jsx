import './css/style.css';

import './charts/ChartjsConfig';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import ProtectedRoute from './Admindashboard/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RoleBasedDashboard from './RoleBasedDashboard';


function App() {
  return (
    <>
     <ToastContainer theme="dark" />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <RoleBasedDashboard />
        </ProtectedRoute>} />
    </Routes>
      {/* <Dashboard /> */}
    </>
  );
}

export default App;
