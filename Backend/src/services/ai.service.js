const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The candidate's match score for the job"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("the intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach should be used etc")
    })).describe("Technical question that can be asked in the interview along with there intention and approch "),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("the intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach should be used ")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and approach"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skills that the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
    })).describe("List of the skill gaps in the cadidate's profile along with theris severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("the day number in preparation plan staring from day 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan")
    })).describe("a day-wise preparation plan for the candidate to follow in order to prepare for the interview."),
    title:z.string().describe("The title of the job for which the interview report is generated")
})

const interviewReportResponseSchema = {
    type: "object",
    properties: {
        matchScore: { type: "number", minimum: 0, maximum: 100 },
        title: { type: "string" },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "title", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
}

const moreContentSchemas = {
    technicalQuestions: {
        type: "array",
        items: {
            type: "object",
            properties: {
                question: { type: "string" },
                intention: { type: "string" },
                answer: { type: "string" }
            },
            required: ["question", "intention", "answer"]
        }
    },
    behavioralQuestions: {
        type: "array",
        items: {
            type: "object",
            properties: {
                question: { type: "string" },
                intention: { type: "string" },
                answer: { type: "string" }
            },
            required: ["question", "intention", "answer"]
        }
    },
    preparationPlan: {
        type: "array",
        items: {
            type: "object",
            properties: {
                day: { type: "number" },
                focus: { type: "string" },
                tasks: { type: "array", items: { type: "string" } }
            },
            required: ["day", "focus", "tasks"]
        }
    }
}


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
        You are an expert technical interviewer.

        Analyze the candidate's resume, self-description, and job description.
        Your task is to create an INTERVIEW PREPARATION REPORT.

        IMPORTANT:
        You MUST generate the response according to the provided JSON schema.

        The response must contain EXACTLY these six fields:

        1. matchScore (a number from 0 to 100)
        2. title
        3. technicalQuestions
        4. behavioralQuestions
        5. skillGaps
        6. preparationPlan

        For every technical question, provide and also note that there can be more then one technical question:
        - question
        - intention
        - answer

        For every behavioral question, provide and also note that there can be more then one behavioral question:
        - question
        - intention
        - answer

        For every skill gap, provide and also note that there can be more then one skill gap :
        - skill
        - severity

        For the preparation plan, provide and note that it should be a complete plan to fill the skill gaps (effectivly and detailed) and not just one day plan:
        - day
        - focus
        - tasks

        Do NOT generate:
        candidateName,
        jobTitle,
        overallScore,
        evaluationSummary,
        assessmentDetails,
        recommendation,
        nextSteps,
        or any other fields.

        Candidate Resume:
        ${resume}

        Candidate Self Description:
        ${selfDescription}

        Job Description:
        ${jobDescription}
        `;

    let res
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            res = await ai.models.generateContent({
                model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: interviewReportResponseSchema
                }
            })
            break
        } catch (error) {
            const isTemporary = error?.status === 503 || error?.code === 503
            if (!isTemporary || attempt === 1) {
                throw error
            }
            await new Promise((resolve) => setTimeout(resolve, 1500))
        }
    }
    return interviewReportSchema.parse(JSON.parse(res.text))
}

async function generateMoreInterviewContent({ section, report }) {
    const existingItems = report[section] || []
    const sectionLabel = section === "preparationPlan" ? "preparation roadmap days" : section
    const prompt = `
        Generate exactly 3 new ${sectionLabel} for this interview preparation report.
        Do not repeat any existing item. Return only the requested array.
        Existing items:
        ${JSON.stringify(existingItems)}
        Job title: ${report.title}
    `
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: { [section]: moreContentSchemas[section] },
                required: [section]
            }
        }
    })
    const parsed = JSON.parse(response.text)
    return parsed[section]
}

module.exports = { generateInterviewReport, generateMoreInterviewContent };