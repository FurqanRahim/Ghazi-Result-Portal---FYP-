import { Navigate } from "react-router-dom";
import Dashboard from "./AdminPages/Dashboard";
import TeacherDashboard from "./TeacherPages/TeacherDashboard";
import StudentDashboard from "./StudentPages/StudentDashboard";
// RoleBasedDashboard Component
const RoleBasedDashboard = () => {
    const role = localStorage.getItem("userRole"); // Assuming you store the role in localStorage after login
  
    switch (role) {
      case "admin":
        return <Dashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "student":
        return <StudentDashboard />
      default:
        return <Navigate to="/login" />;
    }
  };
  
  export default RoleBasedDashboard