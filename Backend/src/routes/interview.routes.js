const express = require("express")
const authmiddleware = require("../middleware/auth.middleware")
const interviewRouter = express.Router()
const interviewController = require("../controller/interview.controller")
const upload = require("../middleware/file.middleware")


interviewRouter.post("/",authmiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

interviewRouter.get("/report/:interviewId",authmiddleware.authUser,interviewController.getInterviewReportByIdController)

interviewRouter.post("/report/:interviewId/more",authmiddleware.authUser,interviewController.generateMoreInterviewContentController)

interviewRouter.get("/",authmiddleware.authUser,interviewController.getAllInterviewReports)

module.exports=interviewRouter