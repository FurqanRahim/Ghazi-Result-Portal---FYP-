const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student.js');
const Course = require('../models/course');
const Class = require('../models/class');
const Result = require('../models/result');
const Teacher = require('../models/teacher');
const AppError = require('../utils/appError');
const { default: mongoose } = require('mongoose');
const ExcelJS = require('exceljs');

const CsvParser = require("json2csv").Parser;

const addStudentResult = catchAsync(async (req, res, next) => {
    const { registrationNumber, classId, courseId, teacherId, mid, session, Final } = req.body;

    // Validate the input
    if (!registrationNumber || !classId || !courseId || !teacherId) {
        return next(new AppError("Registration number, classId, courseId, and teacherId are required.", 400));
    }

    // Check if the student exists
    const student = await Student.findOne({ reg_No: { $regex: new RegExp(`^${registrationNumber}$`, 'i') } });
    if (!student) {
        return next(new AppError("Student with this registration number not found.", 404));
    }

    // Validate class, course, and teacher
    const classExists = await Class.findById(classId);
    if (!classExists) return next(new AppError("Class with the given ID not found.", 404));
    
    const course = await Course.findById(courseId);
    if (!course) return next(new AppError("Course with the given ID not found.", 404));
    
    const teacherExists = await Teacher.findById(teacherId);
    if (!teacherExists) return next(new AppError("Teacher with the given ID not found.", 404));

    // Check if result already exists
    const existingResult = await Result.findOne({ student: student._id, course: courseId, class: classId, teacher: teacherId });
    if (existingResult) {
        return next(new AppError("Result already exists for this student in this course.", 400));
    }

    // Calculate total marks
    const totalMarks = (mid || 0) + (session || 0) + (Final || 0);

    // Determine pass/fail status
    let status = "Fail";
    if ((course.creditHours === 6 && totalMarks > 48)||
        (course.creditHours === 5 && totalMarks > 40)||
        (course.creditHours === 4 && totalMarks > 32)||
        (course.creditHours === 3 && totalMarks > 24) ||
        (course.creditHours === 2 && totalMarks > 16) ||
        (course.creditHours === 1 && totalMarks > 8)) {
        status = "Pass";
    }

    // Function to determine quality point and grade
    function getQualityPointAndGrade(marks, creditHours) {
        let table;
        if (creditHours === 6) table ={48: 6.00,
            49: 6.50,
            50: 7.00,
            51: 7.50,
            52: 8.00,
            53: 8.50,
            54: 9.00,
            55: 9.50,
            56: 10.00,
            57: 10.50,
            58: 11.00,
            59: 11.50,
            60: 12.00,
            61: 12.33,
            62: 12.67,
            63: 13.00,
            64: 13.33,
            65: 13.67,
            66: 14.00,
            67: 14.33,
            68: 14.67,
            69: 15.00,
            70: 15.33,
            71: 15.67,
            72: 16.00,
            73: 16.33,
            74: 16.67,
            75: 17.00,
            76: 17.33,
            77: 17.67,
            78: 18.00,
            79: 18.33,
            80: 18.67,
            81: 19.00,
            82: 19.33,
            83: 19.67,
            84: 20.00,
            85: 20.33,
            86: 20.67,
            87: 21.00,
            88: 21.33,
            89: 21.67,
            90: 22.00,
            91: 22.33,
            92: 22.67,
            93: 23.00,
            94: 23.33,
            95: 23.67,
            96: 24.00,
            97: 24.00,
            98: 24.00,
            99: 24.00,
            100: 24.00,
            101: 24.00,
            102: 24.00,
            103: 24.00,
            104: 24.00,
            105: 24.00,
            106: 24.00,
            107: 24.00,
            108: 24.00,
            109: 24.00,
            110: 24.00,
            111: 24.00,
            112: 24.00,
            113: 24.00,
            114: 24.00,
            115: 24.00,
            116: 24.00,
            117: 24.00,
            118: 24.00,
            119: 24.00,
            120: 24.00}
        else if (creditHours === 5) table ={40: 5.00,
            41: 5.50,
            42: 6.00,
            43: 6.50,
            44: 7.00,
            45: 7.50,
            46: 8.00,
            47: 8.50,
            48: 9.00,
            49: 9.50,
            50: 10.00,
            51: 10.33,
            52: 10.67,
            53: 11.00,
            54: 11.33,
            55: 11.67,
            56: 12.00,
            57: 12.33,
            58: 12.67,
            59: 13.00,
            60: 13.33,
            61: 13.67,
            62: 14.00,
            63: 14.33,
            64: 14.67,
            65: 15.00,
            66: 15.33,
            67: 15.67,
            68: 16.00,
            69: 16.33,
            70: 16.67,
            71: 17.00,
            72: 17.33,
            73: 17.67,
            74: 18.00,
            75: 18.33,
            76: 18.67,
            77: 19.00,
            78: 19.33,
            79: 19.67,
            80: 20.00,
            81: 20.00,
            82: 20.00,
            83: 20.00,
            84: 20.00,
            85: 20.00,
            86: 20.00,
            87: 20.00,
            88: 20.00,
            89: 20.00,
            90: 20.00,
            91: 20.00,
            92: 20.00,
            93: 20.00,
            94: 20.00,
            95: 20.00,
            96: 20.00,
            97: 20.00,
            98: 20.00,
            99: 20.00,
            100: 20.00}
        else if (creditHours === 4) table ={32: 4.00,
            33: 4.50,
            34: 5.00,
            35: 5.50,
            36: 6.00,
            37: 6.50,
            38: 7.00,
            39: 7.50,
            40: 8.00,
            41: 8.33,
            42: 8.67,
            43: 9.00,
            44: 9.33,
            45: 9.67,
            46: 10.00,
            47: 10.33,
            48: 10.67,
            49: 11.00,
            50: 11.33,
            51: 11.67,
            52: 12.00,
            53: 12.33,
            54: 12.67,
            55: 13.00,
            56: 13.33,
            57: 13.67,
            58: 14.00,
            59: 14.33,
            60: 14.67,
            61: 15.00,
            62: 15.33,
            63: 15.67,
            64: 16.00,
            65: 16.00,
            66: 16.00,
            67: 16.00,
            68: 16.00,
            69: 16.00,
            70: 16.00,
            71: 16.00,
            72: 16.00,
            73: 16.00,
            74: 16.00,
            75: 16.00,
            76: 16.00,
            77: 16.00,
            78: 16.00,
            79: 16.00,
            80: 16.00}
        else if (creditHours === 3) table = { 24: 3.00, 25: 3.50, 26: 4.00, 27: 4.50, 28: 5.00,29:5.50, 30: 6.00,31:6.33,32:6.67, 33: 7.00,34:7.33,35:7.67, 36: 8.00,37:8.33,38:8.67, 39: 9.00,40:9.33,41:9.67, 42: 10.00,43:10.33,44:10.67, 45: 11.00,46:11.33,47:11.67, 48: 12.00 };
        else if (creditHours === 2) table = { 16: 2.00, 17: 2.50, 18: 3.00, 19: 3.50, 20: 4.00,21:4.33, 22: 4.67,23:5.00, 24: 5.33, 26: 6.00,27:6.33, 28: 6.67,29:7.00, 30: 7.33,31:7.67, 32: 8.00 };
        else table = { 8: 1.00, 9: 1.50, 10: 2.00, 11: 2.33, 12: 2.67, 13: 3.00, 14: 3.33, 15: 3.67, 16: 4.00 };

        let qualityPoint = 0;
        for (const [key, value] of Object.entries(table)) {
            if (marks >= key) qualityPoint = value;
        }
        let grade;
        if (course.creditHours === 6){        
            if (qualityPoint >= 24.00) grade = "A";
            else if (qualityPoint >= 18.00) grade = "B";
            else if (qualityPoint >= 12.00) grade = "C";
            else if (qualityPoint >= 6.00) grade = "D";
            else grade = "F";
        }
        else if (course.creditHours === 5){        
            if (qualityPoint >= 20.00) grade = "A";
            else if (qualityPoint >= 15.00) grade = "B";
            else if (qualityPoint >= 10.00) grade = "C";
            else if (qualityPoint >= 5.00) grade = "D";
            else grade = "F";
        }
        else if (course.creditHours === 4){        
            if (qualityPoint >= 16.00) grade = "A";
            else if (qualityPoint >= 12.00) grade = "B";
            else if (qualityPoint >= 8.00) grade = "C";
            else if (qualityPoint >= 4.00) grade = "D";
            else grade = "F";
        }
        else if (course.creditHours === 3){        
            if (qualityPoint >= 12.00) grade = "A";
            else if (qualityPoint >= 9.00) grade = "B";
            else if (qualityPoint >= 6.00) grade = "C";
            else if (qualityPoint >= 3.00) grade = "D";
            else grade = "F";
        }
        else if (course.creditHours === 2){        
            if (qualityPoint >= 8.00) grade = "A";
            else if (qualityPoint >= 6.00) grade = "B";
            else if (qualityPoint >= 4.00) grade = "C";
            else if (qualityPoint >= 2.00) grade = "D";
            else grade = "F";
        }
        else if (course.creditHours === 1){        
            if (qualityPoint >= 4.00) grade = "A";
            else if (qualityPoint >= 3.00) grade = "B";
            else if (qualityPoint >= 2.00) grade = "C";
            else if (qualityPoint >= 1.00) grade = "D";
            else grade = "F";
        }
        return { qualityPoint, grade };
    }


    const { qualityPoint,grade} = getQualityPointAndGrade(totalMarks, course.creditHours);

    // Create the result
    const result = await Result.create({
        student: student._id,
        course: courseId,
        class: classId,
        teacher: teacherId,
        mid: mid || 0,
        session: session || 0,
        Final: Final || 0,
        status: status,
        qualitypoint: qualityPoint,
        grade: grade
    });

    res.status(201).json({
        status: "success",
        message: "Result added successfully.",
        result,
    });
});



const getAllResults = catchAsync(async (req, res, next) => {
    // Fetch all results and populate related information
    const results = await Result.find()
        .populate('student', 'name reg_No')
        .populate('course', 'courseCode courseName year creditHours')
        .populate('class', 'className classCode shift section')
        .populate('teacher', 'name');

    // Check if results exist
    if (!results || results.length === 0) {
        return next(new AppError("No results found.", 404));
    }

    res.status(200).json({
        status: "success",
        results: results.length,
        data: results
    });
});

const exportResultsToExcel = catchAsync(async (req, res, next) => {
    // Fetch results and populate related information
    const results = await Result.find()
        .populate('student', 'name reg_No')
        .populate('course', 'courseCode courseName year')
        .populate('class', 'className classCode shift section')
        .populate('teacher', 'name');

    // Check if there are results to export
    if (!results || results.length === 0) {
        return next(new AppError("No results found to export.", 404));
    }

    // Prepare data for the CSV
    const csvData = results.map((result) => ({
        "Student Name": result.student.name,
        "Registration Number": result.student.reg_No,
        "Course Code": result.course.courseCode,
        "Course Name": result.course.courseName,
        "Session": result.course.year,
        "Class Name": result.class.className,
        "Class Code": result.class.classCode,
        "Teacher Name": result.teacher.name,
        "Mid Term Marks": result.mid,
        "Session Marks": result.session,
        "Final Marks": result.Final,
        "Total Marks": result.mid + result.session + result.Final,
        "Result Date": result.createdAt.toISOString()
    }));

    // Define CSV fields
    const fields = [
        "Student Name",
        "Registration Number",
        "Course Code",
        "Course Name",
        "Session",
        "Class Name",
        "Class Code",
        "Teacher Name",
        "Mid Term Marks",
        "Session Marks",
        "Final Marks",
        "Total Marks",
        "Result Date"
    ];

    // Initialize CSV parser
    const csvParser = new CsvParser({ fields });
    const csv = csvParser.parse(csvData);

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=ResultData.csv");

    // Send the CSV file as the response
    res.status(200).end(csv);
});

const deleteResult = catchAsync(async (req, res, next) => {
    const resultId = req.params.id;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
        return next(new AppError('Invalid result ID format.', 400));
    }

    // Attempt to find and delete the result
    const deletedResult = await Result.findByIdAndDelete(resultId);

    // If the result doesn't exist
    if (!deletedResult) {
        return next(new AppError('Result not found.', 404));
    }

    // Successfully deleted
    res.status(200).json({
        status: "success",
        message: 'Result deleted successfully.',
        data: deletedResult
    });
});

const getStudentResult = async (req, res) => {
    try {
        const {studentId , classId, courseId} = req.params;

        // Find all results for the student
        const results = await Result.find({ student: studentId, class: classId, course: courseId  })
            .populate('course', 'courseName creditHours') // Populate course details (only name in this case)
            .populate('class', 'className classCode shift section')  // Populate class details (only name in this case)
            .populate('teacher', 'name'); // Populate teacher details (only name in this case)

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No results found for this student' });
        }

        // Calculate total marks
        let totalMarks = 0;
        const marksDetails = results.map(result => {
            const courseMarks = result.mid + result.session + result.Final;
            totalMarks += courseMarks;

            return {
                course: result.course.courseName,
                creditHours: result.course.creditHours,
                className: result.class.className,
                classCode: result.class.classCode,
                shift: result.class.shift,
                section: result.class.section || null,
                teacher: result.teacher.name,
                mid: result.mid,
                session: result.session,
                Final: result.Final,
                qualitypoint:result.qualitypoint,
                status:result.status,
                totalCourseMarks: courseMarks,
            };
        });

        res.status(200).json({
            studentId,
            marksDetails,
            totalMarks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const getStudentResultByClass = async (req, res) => {
    try {
        const {studentId , classId} = req.params;

        // Find all results for the student
        const results = await Result.find({ student: studentId, class: classId})
            .populate('course', 'courseName creditHours') // Populate course details (only name in this case)
            .populate('class', 'className classCode shift section')  // Populate class details (only name in this case)
            .populate('teacher', 'name'); // Populate teacher details (only name in this case)

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No results found for this student' });
        }

        // Calculate total marks
        let totalMarks = 0;
        const marksDetails = results.map(result => {
            const courseMarks = result.mid + result.session + result.Final;
            totalMarks += courseMarks;

            return {
                course: result.course.courseName,
                creditHours: result.course.creditHours,
                className: result.class.className,
                classCode: result.class.classCode,
                shift: result.class.shift,
                section: result.class.section || null,
                teacher: result.teacher.name,
                mid: result.mid,
                session: result.session,
                Final: result.Final,
                qualitypoint:result.qualitypoint,
                grade:result.grade,
                status:result.status,
                totalCourseMarks: courseMarks,

            };
        });

        res.status(200).json({
            studentId,
            marksDetails,
            totalMarks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getStudent = async (req, res) => {
    try {
        

        // Find all results for the student
        const results = await Result.find()
            .populate('student', 'reg_No name') // Populate course details (only name in this case)
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No results found' });
        }


        res.status(200).json({
           results:results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



const exportStudentResultToExcel = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find all results for the student
        const results = await Result.find({ student: studentId })
            .populate('course', 'courseName')
            .populate('class', 'className classCode shift section')
            .populate('teacher', 'name');

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No results found for this student' });
        }

        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Student Result');

        // Add headers to the worksheet
        worksheet.addRow([
            'Course', 'Class Name', 'Class Code', 'Shift', 'Section', 'Teacher', 'Mid', 'Session', 'Final', 'Total Marks'
        ]);

        let totalMarks = 0;

        // Add data rows to the worksheet
        results.forEach(result => {
            const courseMarks = result.mid + result.session + result.Final;
            totalMarks += courseMarks;

            worksheet.addRow([
                result.course.courseName,
                result.class.className,
                result.class.classCode,
                result.class.shift,
                result.class.section || '',
                result.teacher.name,
                result.mid,
                result.session,
                result.Final,
                courseMarks
            ]);
        });

        // Add total marks row
        worksheet.addRow([]); // Empty row for separation
        worksheet.addRow(['', '', '', '', '', '', '', '', 'Total Marks', totalMarks]);

        // Set response headers for file download
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename=Student_${studentId}_Result.xlsx`);

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getResultsByClassAndCourse = catchAsync(async (req, res, next) => {
    const { classId, courseId } = req.params; // Extract classId and courseId from request parameters

    // Fetch results based on class ID and course ID
    const results = await Result.find({ class: classId, course: courseId })
        .populate('student', 'name reg_No')
        .populate('course', 'courseCode courseName year creditHours')
        .populate('class', 'className classCode shift section')
        .populate('teacher', 'name');

    // Check if results exist
    if (!results || results.length === 0) {
        return next(new AppError("No results found for the given class and course.", 404));
    }

    res.status(200).json({
        status: "success",
        results: results.length,
        data: results
    });
});




module.exports = { 
    addStudentResult, 
    getAllResults, 
    exportResultsToExcel, 
    deleteResult ,
    getStudentResult,
    getStudentResultByClass,
    getStudent,
    exportStudentResultToExcel,
    getResultsByClassAndCourse
};