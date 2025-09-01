const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const Enrollment = require('../models/enrollment');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const Notification = require('../models/notification');
const wss = require('../websocket.js'); // Import the WebSocket server
require("dotenv").config();
const takeAttendance = async (req, res) => {
  try {
      const { courseId, classId, teacherId, date, attendance } = req.body;

      // Validate required fields
      if (!courseId || !classId || !teacherId || !attendance) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(courseId) || 
          !mongoose.Types.ObjectId.isValid(classId) || 
          !mongoose.Types.ObjectId.isValid(teacherId)) {
          return res.status(400).json({ message: "Invalid ObjectId format" });
      }

      // Validate attendanceRecords is an array
      if (!Array.isArray(attendance) || attendance.length === 0) {
          return res.status(400).json({ message: "Invalid attendance records" });
      }
      if (!date || isNaN(new Date(date).getTime())) {
          return res.status(400).json({ message: 'Invalid date format' });
      }

      // Ensure each record has a valid studentId and status
      for (let record of attendance) {
          if (!record.studentId || !mongoose.Types.ObjectId.isValid(record.studentId)) {
              return res.status(400).json({ message: "Invalid student ID in attendance records" });
          }
          if (!record.status || !["Present", "Absent"].includes(record.status)) {
              return res.status(400).json({ message: "Invalid status in attendance records" });
          }
      }

      // Check if attendance already exists for the same date, course, class, and teacher
      const existingAttendance = await Attendance.findOne({
          course: courseId,
          class: classId,
          teacher: teacherId,
          date: new Date(date),
      });

      if (existingAttendance) {
          return res.status(400).json({ message: "Attendance for this date already exists" });
      }

      // Insert attendance records
      const attendanceEntries = attendance.map(record => ({
          student: record.studentId,
          course: courseId,
          class: classId,
          date: new Date(date),
          teacher: teacherId,
          status: record.status,
      }));

      await Attendance.insertMany(attendanceEntries);

      res.status(200).json({ message: "Attendance submitted successfully" });

  } catch (error) {
      console.error("Error taking attendance:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getAttendance = async (req, res) => {
    try {
      const { classId, courseId, date } = req.query;
  
      // Validate required fields
      if (!classId || !courseId || !date) {
        return res.status(400).json({ message: "Class ID, Course ID, and Date are required" });
      }
  
      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid Class ID or Course ID" });
      }
  
      // Validate date format
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format. Use MM-DD-YYYY" });
      }
  
      // Fetch students enrolled in the specified class and course from Enrollment
      const enrollments = await Enrollment.find({ class: classId, course: courseId }).populate("student");
  
      if (enrollments.length === 0) {
        return res.status(404).json({ message: "No students found for the specified class and course" });
      }
  
      // Extract student IDs
      const studentIds = enrollments.map(enrollment => enrollment.student._id);
  
      // Fetch attendance records for these students on the specified date
      const attendanceRecords = await Attendance.find({
        student: { $in: studentIds },
        class: classId,
        course: courseId,
        date: parsedDate, // Filter by the provided date
      });
  
      // Combine student data with attendance records
      const studentsWithAttendance = enrollments.map(enrollment => {
        const student = enrollment.student;
        const studentAttendance = attendanceRecords.find(record => record.student.equals(student._id));
  
        return {
          studentId: student._id,
          name: student.name,
          reg_No: student.reg_No,
          attendance: studentAttendance
            ? {
                date: studentAttendance.date,
                status: studentAttendance.status, // "present" or "absent"
              }
            : null, // If no attendance record exists for the date
        };
      });
  
      res.status(200).json({ students: studentsWithAttendance });
    } catch (error) {
      console.error("Error fetching students with attendance:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  // get particular student attendance 

  const getStudentAttendance = async (req, res) => {
    try {
        const { studentId, classId, courseId, date } = req.query;

        // Validate required fields
        if (!studentId || !classId || !courseId || !date) {
            return res.status(400).json({ message: "Student ID, Class ID, Course ID, and Date are required" });
        }

        // Validate ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(studentId) ||
            !mongoose.Types.ObjectId.isValid(classId) ||
            !mongoose.Types.ObjectId.isValid(courseId)
        ) {
            return res.status(400).json({ message: "Invalid Student ID, Class ID, or Course ID" });
        }

        // Validate date format
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format. Use MM-DD-YYYY" });
        }

        // Check if the student is enrolled in the specified class and course
        const enrollment = await Enrollment.findOne({
            student: studentId,
            class: classId,
            course: courseId,
        }).populate("student");

        if (!enrollment) {
            return res.status(404).json({ message: "Student not found in the specified class and course" });
        }

        // Fetch attendance record for the student on the specified date
        const attendanceRecord = await Attendance.findOne({
            student: studentId,
            class: classId,
            course: courseId,
            date: parsedDate, // Filter by the provided date
        });

        // Prepare the response
        const studentAttendance = {
            studentId: enrollment.student._id,
            name: enrollment.student.name,
            reg_No: enrollment.student.reg_No,
            attendance: attendanceRecord
                ? {
                      date: attendanceRecord.date,
                      status: attendanceRecord.status, // "present" or "absent"
                  }
                : null, // If no attendance record exists for the date
        };

        res.status(200).json({ student: studentAttendance });
    } catch (error) {
        console.error("Error fetching student attendance:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


  const exportAttendance = async (req, res) => {
    try {
        const { classId, courseId } = req.query;

        if (!classId || !courseId) {
            return res.status(400).json({ message: "Class ID and Course ID are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid Class ID or Course ID" });
        }

        const enrollments = await Enrollment.find({ class: classId, course: courseId }).populate("student");
        if (enrollments.length === 0) {
            return res.status(404).json({ message: "No students found for the specified class and course" });
        }

        const studentIds = enrollments.map(enrollment => enrollment.student._id);

        const attendanceRecords = await Attendance.find({
            student: { $in: studentIds },
            class: classId,
            course: courseId,
        }).populate("student");

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found for the specified class and course" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        let uniqueDates = [...new Set(attendanceRecords.map(record => record.date.toISOString().split('T')[0]))];
        uniqueDates.sort();

        worksheet.columns = [
            { header: 'Student ID', key: 'studentId', width: 15 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Registration Number', key: 'regNo', width: 20 },
            ...uniqueDates.map(date => ({ header: date, key: date, width: 15 }))
        ];

        let studentAttendanceMap = {};
        enrollments.forEach(enrollment => {
            studentAttendanceMap[enrollment.student._id] = {
                studentId: enrollment.student._id,
                name: enrollment.student.name,
                regNo: enrollment.student.reg_No,
            };
            uniqueDates.forEach(date => {
                studentAttendanceMap[enrollment.student._id][date] = 'Absent';
            });
        });

        attendanceRecords.forEach(record => {
            let dateKey = record.date.toISOString().split('T')[0];
            if (studentAttendanceMap[record.student._id]) {
                studentAttendanceMap[record.student._id][dateKey] = record.status;
            }
        });

        Object.values(studentAttendanceMap).forEach(student => {
            worksheet.addRow(student);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=attendance.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error exporting attendance data:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// const exportAttendance = async (req, res) => {
//   try {
//       const { classId, courseId } = req.query;

//       // Validate required fields
//       if (!classId || !courseId) {
//           return res.status(400).json({ message: "Class ID and Course ID are required" });
//       }

//       // Validate ObjectIds
//       if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(courseId)) {
//           return res.status(400).json({ message: "Invalid Class ID or Course ID" });
//       }

//       // Fetch students enrolled in the specified class and course from Enrollment
//       const enrollments = await Enrollment.find({ class: classId, course: courseId }).populate("student");

//       if (enrollments.length === 0) {
//           return res.status(404).json({ message: "No students found for the specified class and course" });
//       }

//       // Extract student IDs
//       const studentIds = enrollments.map(enrollment => enrollment.student._id);

//       // Fetch all attendance records for these students in the specified class and course
//       const attendanceRecords = await Attendance.find({
//           student: { $in: studentIds },
//           class: classId,
//           course: courseId,
//       }).populate("student");

//       if (attendanceRecords.length === 0) {
//           return res.status(404).json({ message: "No attendance records found for the specified class and course" });
//       }

//       // Group attendance records by student
//       const groupedRecords = {};
//       attendanceRecords.forEach(record => {
//           const studentId = record.student._id.toString();
//           if (!groupedRecords[studentId]) {
//               groupedRecords[studentId] = {
//                   studentId: record.student._id,
//                   name: record.student.name,
//                   regNo: record.student.reg_No,
//                   attendance: {},
//               };
//           }
//           // Add attendance status for the specific date
//           const dateKey = record.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
//           groupedRecords[studentId].attendance[dateKey] = record.status;
//       });

//       // Get all unique dates from the attendance records
//       const allDates = [...new Set(attendanceRecords.map(record => record.date.toISOString().split('T')[0]))];
//       allDates.sort((a, b) => new Date(a) - new Date(b)); // Sort dates in ascending order

//       // Create a new workbook and worksheet
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Attendance');

//       // Define columns in the Excel sheet
//       const columns = [
//           { header: 'Student ID', key: 'studentId', width: 15 },
//           { header: 'Name', key: 'name', width: 20 },
//           { header: 'Registration Number', key: 'regNo', width: 20 },
//       ];

//       // Add a column for each date
//       allDates.forEach(date => {
//           columns.push({ header: date, key: date, width: 15 });
//       });

//       worksheet.columns = columns;

//       // Add rows to the worksheet
//       Object.values(groupedRecords).forEach(student => {
//           const row = {
//               studentId: student.studentId,
//               name: student.name,
//               regNo: student.regNo,
//           };

//           // Add attendance status for each date
//           allDates.forEach(date => {
//               row[date] = student.attendance[date] || 'N/A'; // Use 'N/A' if no record exists for the date
//           });

//           worksheet.addRow(row);
//       });

//       // Set response headers for file download
//       res.setHeader(
//           'Content-Type',
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       );
//       res.setHeader(
//           'Content-Disposition',
//           'attachment; filename=attendance.xlsx'
//       );

//       // Write the workbook to the response
//       await workbook.xlsx.write(res);
//       res.end();
//   } catch (error) {
//       console.error("Error exporting attendance data:", error);
//       res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

const getLowAttendanceStudents = async (req, res) => {
    try {
        const { classId, courseId } = req.query;

        // Validate required fields
        if (!classId || !courseId) {
            return res.status(400).json({ message: "Class ID and Course ID are required" });
        }

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid Class ID or Course ID" });
        }

        // Fetch students enrolled in the specified class and course from Enrollment
        const enrollments = await Enrollment.find({ class: classId, course: courseId }).populate("student");

        if (enrollments.length === 0) {
            return res.status(404).json({ message: "No students found for the specified class and course" });
        }

        // Extract student IDs
        const studentIds = enrollments.map(enrollment => enrollment.student._id);

        // Fetch all attendance records for these students in the specified course and class
        const attendanceRecords = await Attendance.find({
            student: { $in: studentIds },
            class: classId,
            course: courseId,
        });

        // Calculate attendance percentage for each student
        const studentsWithAttendancePercentage = enrollments.map(enrollment => {
            const student = enrollment.student;
            const studentAttendanceRecords = attendanceRecords.filter(record => record.student.equals(student._id));

            const totalClasses = studentAttendanceRecords.length;
            const presentClasses = studentAttendanceRecords.filter(record => record.status === 'Present').length;

            const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

            return {
                studentId: student._id,
                name: student.name,
                reg_No: student.reg_No,
                attendancePercentage: attendancePercentage.toFixed(2), // Round to 2 decimal places
            };
        });

        // Filter students with less than 75% attendance
        const lowAttendanceStudents = studentsWithAttendancePercentage.filter(student => student.attendancePercentage < 75);

        res.status(200).json({ students: lowAttendanceStudents });
    } catch (error) {
        console.error("Error fetching students with low attendance:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}; 

const exportStudentAttendance = async (req, res) => {
    try {
        const { classId, courseId, studentId } = req.query;

        if (!classId || !courseId || !studentId) {
            return res.status(400).json({ message: "Class ID, Course ID, and Student ID are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Invalid Class ID, Course ID, or Student ID" });
        }

        const enrollment = await Enrollment.findOne({ class: classId, course: courseId, student: studentId }).populate("student");
        if (!enrollment) {
            return res.status(404).json({ message: "No student found for the specified class, course, and student ID" });
        }

        const attendanceRecords = await Attendance.find({
            student: studentId,
            class: classId,
            course: courseId,
        }).populate("student");

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found for the specified student, class, and course" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        let uniqueDates = [...new Set(attendanceRecords.map(record => record.date.toISOString().split('T')[0]))];
        uniqueDates.sort();

        worksheet.columns = [
            { header: 'Student ID', key: 'studentId', width: 15 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Registration Number', key: 'regNo', width: 20 },
            ...uniqueDates.map(date => ({ header: date, key: date, width: 15 }))
        ];

        let studentAttendance = {
            studentId: enrollment.student._id,
            name: enrollment.student.name,
            regNo: enrollment.student.reg_No,
        };

        uniqueDates.forEach(date => {
            studentAttendance[date] = 'Absent';
        });

        attendanceRecords.forEach(record => {
            let dateKey = record.date.toISOString().split('T')[0];
            studentAttendance[dateKey] = record.status;
        });

        worksheet.addRow(studentAttendance);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=attendance.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error exporting attendance data:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// Endpoint to send emails to low-attendance students
// const sendLowAttendanceEmails = async (req, res) => {
//     try {
//         const { classId, courseId } = req.body; // Use req.body for POST requests

//         // Validate required fields
//         if (!classId || !courseId) {
//             return res.status(400).json({ message: "Class ID and Course ID are required" });
//         }

//         // Validate ObjectIds
//         if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(courseId)) {
//             return res.status(400).json({ message: "Invalid Class ID or Course ID" });
//         }

//         // Fetch low-attendance students
//         const enrollments = await Enrollment.find({ class: classId, course: courseId })
//             .populate("student")
//             .populate("course"); // Populate the course details

//         const studentIds = enrollments.map(enrollment => enrollment.student._id);

//         const attendanceRecords = await Attendance.find({
//             student: { $in: studentIds },
//             class: classId,
//             course: courseId,
//         });

//         const lowAttendanceStudents = enrollments.map(enrollment => {
//             const student = enrollment.student;
//             const course = enrollment.course; // Access the populated course details
//             const studentAttendanceRecords = attendanceRecords.filter(record => record.student.equals(student._id));

//             const totalClasses = studentAttendanceRecords.length;
//             const presentClasses = studentAttendanceRecords.filter(record => record.status === 'Present').length;

//             const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

//             return {
//                 studentId: student._id,
//                 name: student.name,
//                 email: student.email, // Ensure the student model has an email field
//                 reg_No: student.reg_No,
//                 attendancePercentage: attendancePercentage.toFixed(2),
//                 courseName: course[0].courseName, // Add the course name here
//             };
//         }).filter(student => student.attendancePercentage < 75);

//         if (lowAttendanceStudents.length === 0) {
//             return res.status(404).json({ message: "No low-attendance students found" });
//         }
//         // console.log(lowAttendanceStudents)
//         // Send emails to low-attendance students
//         const emailPromises = lowAttendanceStudents.map(student => {
//             const mailOptions = {
//                 from: `"Ghazi IT-Depart" <${process.env.EMAIL_USER}>`,
//                 to: student.email,
//                 subject: 'Low Attendance Notification',
//                 text: `Dear ${student.name},\n\nYour attendance in the course "${student.courseName}" is ${student.attendancePercentage}%, which is below the required threshold. Please ensure regular attendance.\n\nRegards,\nGhazi University D.G.Khan`,
//             };
            
//             return transporter.sendMail(mailOptions);
//         });

//         await Promise.all(emailPromises);

//         res.status(200).json({ status: "success", message: "Emails sent successfully" });
//     } catch (error) {
//         console.error("Error sending emails:", error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

 const sendLowAttendanceEmails = async (req, res) => {
    try {
        const { classId, courseId } = req.body;

        if (!classId || !courseId) {
            return res.status(400).json({ message: "Class ID and Course ID are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid Class ID or Course ID" });
        }

        const enrollments = await Enrollment.find({ class: classId, course: courseId })
            .populate("student")
            .populate("course");

        const studentIds = enrollments.map(enrollment => enrollment.student._id);

        const attendanceRecords = await Attendance.find({
            student: { $in: studentIds },
            class: classId,
            course: courseId,
        });

        const lowAttendanceStudents = enrollments.map(enrollment => {
            const student = enrollment.student;
            const course = enrollment.course;
            const studentAttendanceRecords = attendanceRecords.filter(record => record.student.equals(student._id));

            const totalClasses = studentAttendanceRecords.length;
            const presentClasses = studentAttendanceRecords.filter(record => record.status === 'Present').length;

            const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

            return {
                studentId: student._id,
                name: student.name,
                email: student.email,
                reg_No: student.reg_No,
                attendancePercentage: attendancePercentage.toFixed(2),
                courseName: course[0].courseName,
            };
        }).filter(student => student.attendancePercentage < 75);

        if (lowAttendanceStudents.length === 0) {
            return res.status(404).json({ message: "No low-attendance students found" });
        }

        const emailPromises = lowAttendanceStudents.map(student => {
            const mailOptions = {
                from: `"Ghazi IT-Depart" <${process.env.EMAIL_USER}>`,
                to: student.email,
                subject: 'Low Attendance Notification',
                text: `Dear ${student.name},\n\nYour attendance in the course "${student.courseName}" is ${student.attendancePercentage}%, which is below the required threshold. Please ensure regular attendance.\n\nRegards,\nGhazi University D.G.Khan`,
            };

            // Create a notification for the student
            const notification = new Notification({
                student: student.studentId,
                message: `Your attendance in ${student.courseName} is ${student.attendancePercentage}%. Please ensure regular attendance.`,
            });

            // Save the notification
            return Promise.all([
                transporter.sendMail(mailOptions),
                notification.save(),
            ]).then(() => {
                // Broadcast the notification to the student via WebSocket
                const notificationMessage = JSON.stringify({
                    studentId: student.studentId,
                    message: notification.message,
                });

                // Ensure wss is defined and has clients
                if (wss && wss.clients) {
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN && client.studentId === student.studentId.toString()) {
                            client.send(notificationMessage);
                        }
                    });
                }
            });
        });

        await Promise.all(emailPromises);

        res.status(200).json({ status: "success", message: "Emails and notifications sent successfully" });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



module.exports = {takeAttendance , getAttendance , getStudentAttendance , exportAttendance , exportStudentAttendance , getLowAttendanceStudents , sendLowAttendanceEmails};
