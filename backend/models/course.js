const mongoose = require('mongoose');
const Enrollment = require('./enrollment');

const courseSchema = new mongoose.Schema({
    courseCode: { 
        type: String,
        required: [true, "Please provide a course code"],
    },
    courseName: { 
        type: String, 
        required: [true, "Please provide a course name"],
        trim: true, 
    },
    year: {
        type: String,
        required: [true, "Please enter year."], 
    },
    classes: [
        {
            class: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Class', 
                required: true,
            },
            teacher: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Teacher', 
                required: true,
            },
        }
    ],
    creditHours:{
        type: Number,
        required: [true, "Credit Hours are  required"],
    }
    // Current session (e.g., "2024-2025")
//   teacherHistory: [
//     {
//       teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
//       session: { type: String }, // Academic session
//       startDate: { type: Date, default: Date.now },
//       endDate: { type: Date },
//     }
//   ], // Array to store all past teacher assignments
});

courseSchema.pre('findOneAndDelete', { document: false, query: true }, async function (next) {
    const courseId = this.getQuery()._id; // Access the course ID from the query
    console.log('Middleware Triggered for Course ID:', courseId);

    try {
        // Check if the course is referenced in the Enrollment schema
        const enrollmentExists = await Enrollment.exists({ course: courseId });
        if (enrollmentExists) {
            console.log('Course is referenced in Enrollment schema');
            const error = new Error('This course is referenced in the Enrollment schema. Please remove the reference before deleting.');
            error.statusCode = 400; // Bad request
            return next(error); // Pass error to the next middleware
        }

        next(); // Proceed with deletion if no references found
    } catch (err) {
        console.error('Error in Middleware:', err.message);
        next(err); // Pass unexpected errors to the next middleware
    }
});


module.exports = mongoose.model('Course', courseSchema);
