const pdfParse = require("pdf-parse")
const {generateInterviewReport, generateMoreInterviewContent} = require("../services/ai.service")
const interviewReportModel = require("../model/interviewReport.model")

async function generateInterviewReportController(req,res){
    try {
        const resumeContent = req.file
            ? await (new pdfParse.PDFParse(new Uint8Array(req.file.buffer))).getText()
            : { text: "" }
        const {selfDescription,jobDescription}=req.body

        if (!jobDescription || (!selfDescription && !resumeContent.text)) {
            return res.status(400).json({
                message:"Job description and either a resume or self-description are required"
            })
        }

        const interviewReportByAi = await generateInterviewReport({
            resume:resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user:req.user.id,
            resume:resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message:"interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error("Interview report generation failed:", error)
        const isTemporaryAiFailure = error?.status === 503 || error?.code === 503
        res.status(isTemporaryAiFailure ? 503 : 500).json({
            message: isTemporaryAiFailure
                ? "The AI service is temporarily busy. Please try again in a moment."
                : "Interview report generation failed",
            error:error.message
        })
    }
}

async function getInterviewReportByIdController (req,res){
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id:interviewId,user:req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"intrvie report not found"
        })
    }
    res.status(200).json({
        message:"interview report is feched",
        interviewReport
    })
}

async function generateMoreInterviewContentController(req, res) {
    try {
        const { interviewId } = req.params
        const { section } = req.body
        const allowedSections = ["technicalQuestions", "behavioralQuestions", "preparationPlan"]

        if (!allowedSections.includes(section)) {
            return res.status(400).json({ message: "Invalid interview section" })
        }

        const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        if (!report) {
            return res.status(404).json({ message: "Interview report not found" })
        }

        const newItems = await generateMoreInterviewContent({ section, report })
        report[section].push(...newItems)
        await report.save()

        res.status(200).json({ section, items: report[section] })
    } catch (error) {
        console.error("More interview content generation failed:", error)
        res.status(500).json({ message: "Could not generate more content", error: error.message })
    }
}

async function getAllInterviewReports(req,res){
    const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    res.status(200).json({
        message:"data fetched",
        interviewReports
    })

}

module.exports= {generateInterviewReportController,getInterviewReportByIdController,generateMoreInterviewContentController,getAllInterviewReports}