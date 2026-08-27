const express = require("express")
const userRouter = require("./routes/auth.routers")
const cookieParser = require("cookie-parser");
const interviewRouter = require("./routes/interview.routes")
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://ai-interview-frontend-wbg8.onrender.com"
].filter(Boolean).map((origin) => origin.trim().replace(/\/$/, ""));

app.use(cors({
    origin(origin, callback) {
        const normalizedOrigin = origin?.replace(/\/$/, "");
        callback(null, !origin || allowedOrigins.includes(normalizedOrigin));
    },
    credentials:true
}))
app.use("/api/auth",userRouter)
app.use("/api/interview",interviewRouter)

module.exports= app