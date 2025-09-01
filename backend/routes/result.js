const express = require("express");
const resultController = require("../controllers/result.js");
const router = express.Router();

router.post("/add-result", resultController.addStudentResult);

router.get("/all-results", resultController.getAllResults);
// Add this route in your routes file
router.get('/results/:classId/:courseId', resultController.getResultsByClassAndCourse);

router.get("/export-results", resultController.exportResultsToExcel);

router.delete('/results/:id', resultController.deleteResult);
router.get('/student-result/:studentId/:classId/:courseId',resultController.getStudentResult);

router.get('/student-result/:studentId/:classId',resultController.getStudentResultByClass);
router.get('/students',resultController.getStudent);
router.get('/export-student-result/:studentId',resultController.exportStudentResultToExcel);
module.exports = router;