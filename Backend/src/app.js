const express = require("express")
const userRouter = require("./routes/auth.routers")
const cookieParser = require("cookie-parser");
const interviewRouter = require("./routes/interview.routes")
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))
app.use("/api/auth",userRouter)
app.use("/api/interview",interviewRouter)

module.exports= app