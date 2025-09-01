const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, "Student ID is required"],
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, "Course ID is required"],
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, "Class ID is required"],
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, "Teacher ID is required"],

    },
    mid:{
        type:Number,
        
        default:0,
        
    
    },
    session:{
        type:Number,
        default:0,
        min: [0, 'mid must be at least 0'], 
        max: [6, 'mid cannot exceed 6'], 
   
    },
    Final:{
        type:Number,
        default:0 
      
    },
    status:{
        type: String,
        enum: ['Pass', 'Fail'],
        default:0 
      
    },
    qualitypoint:{
        type:Number,

    },
    grade:{
        type:String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
