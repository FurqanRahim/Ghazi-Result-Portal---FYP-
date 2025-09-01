# 📊 Ghazi Result Portal

Ghazi Result Portal is a **role-based academic result platform** with three dashboards: **Student**, **Teacher**, and **HOD**.  
It enables secure user management, course creation, attendance tracking, enrollment, and result publishing.

---

## 🚀 Key Features
- **Role-Based Dashboards**  
  - **HOD** → Creates courses, assigns classes & teachers.  
  - **Teacher** → Marks attendance, uploads results.  
  - **Student** → Views results, attendance, and academic progress.  

- **Secure Authentication**  
  - Passwords hashed with **bcryptjs**.  
  - Role-based access control for students, teachers, and admins.  

- **Data Models**  
  - **Admin** → Manages portal.  
  - **Student** → Registration, login, course enrollment.  
  - **Teacher** → Assigned to courses & classes.  
  - **Course & Class** → Structured by HOD with shift, section, and credit hours.  
  - **Attendance** → Tracks daily presence/absence.  
  - **Enrollment** → Links students with classes and courses.  
  - **Result** → Stores mid, final, grade, and status.  

- **Database Integrity**  
  - Prevents deletion of records if referenced in other schemas (e.g., Courses, Enrollments).  
  - Cascade cleanups for related entities (e.g., student deletion removes enrollment).  

---

## ⚙️ Tech Stack
- **Backend**: Node.js + Express  
- **Database**: MongoDB + Mongoose ODM  
- **Authentication**: bcryptjs + role-based validation  
- **Validation**: validator.js  

---

## 📌 Summary
The **Ghazi Result Portal** provides a **centralized digital platform** for managing courses, attendance, and results.  
With secure authentication, role-based dashboards, and data integrity rules, it ensures a **reliable academic record system**.  


# 🏗️ Ghazi Result Portal – System Architecture

```mermaid
flowchart TD

subgraph Frontend[User Dashboards]
    StudentUI[Student Dashboard]
    TeacherUI[Teacher Dashboard]
    HODUI[HOD Dashboard]
end

subgraph Backend[Node.js + Express API]
    Auth[Authentication Service]
    StudentCtrl[Student Controller]
    TeacherCtrl[Teacher Controller]
    HODCtrl[HOD Controller]
    AttendanceCtrl[Attendance Service]
    ResultCtrl[Result Service]
end

subgraph Database[MongoDB + Mongoose Models]
    AdminTbl[(Admin Schema)]
    StudentTbl[(Student Schema)]
    TeacherTbl[(Teacher Schema)]
    ClassTbl[(Class Schema)]
    CourseTbl[(Course Schema)]
    EnrollmentTbl[(Enrollment Schema)]
    AttendanceTbl[(Attendance Schema)]
    ResultTbl[(Result Schema)]
end

%% User Interaction
StudentUI -->|Login / View Results| Auth
TeacherUI -->|Login / Manage Results / Attendance| Auth
HODUI -->|Login / Manage Courses| Auth

%% Backend Interaction
Auth --> StudentCtrl
Auth --> TeacherCtrl
Auth --> HODCtrl

StudentCtrl --> StudentTbl
TeacherCtrl --> TeacherTbl
HODCtrl --> AdminTbl

TeacherCtrl --> AttendanceCtrl
TeacherCtrl --> ResultCtrl
AttendanceCtrl --> AttendanceTbl
ResultCtrl --> ResultTbl

HODCtrl --> CourseTbl
HODCtrl --> ClassTbl
HODCtrl --> EnrollmentTbl
CourseTbl --> EnrollmentTbl
ClassTbl --> EnrollmentTbl
StudentCtrl --> EnrollmentTbl
