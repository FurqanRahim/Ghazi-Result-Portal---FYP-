const express = require("express")
const attendanceController = require("../controllers/attendance.js");
const router = express.Router();


// Endpoint to submit attendance
router.post('/submit-attendance',attendanceController.takeAttendance);

router.get('/get-attendance',attendanceController.getAttendance);

router.get('/student-attendance',attendanceController.getStudentAttendance);

router.get('/export-attendance',attendanceController.exportAttendance);

router.get('/export-student-attendance',attendanceController.exportStudentAttendance);

router.get('/low-attendance',attendanceController.getLowAttendanceStudents);
router.post('/send-low-attendance-emails', attendanceController.sendLowAttendanceEmails);

module.exports = router