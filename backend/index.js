// index.js
const express = require("express");
const http = require("http");
const connectDB = require("./db/connectDB.js");
const authRoutes = require("./routes/auth.js");
const cookieParser = require("cookie-parser");
const classRoutes = require("./routes/class.js");
const courseRoutes = require("./routes/course.js");
const enrollmentRoutes = require("./routes/enrollment.js");
const attendanceRoutes = require("./routes/attendance.js");
const notificationRoutes = require("./routes/notification.js");
const resultRoutes = require("./routes/result.js");
const cors = require("cors");
const globalErrorHandler = require("./controllers/error");
const AppError = require("./utils/appError.js");
const wss = require("./websocket"); // Import the WebSocket server
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const port = process.env.PORT || 8000;

// Attach WebSocket server to the HTTP server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", classRoutes);
app.use("/api", courseRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", resultRoutes);
app.use("/api", notificationRoutes);

app.all("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

server.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});

module.exports = { server };