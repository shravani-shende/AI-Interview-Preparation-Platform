import axios from "axios"
import { getAuthToken } from "../../auth/services/auth.api"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const generateInterviewReport = async ({resumeFile,selfDescription,jobDescription})=>{
    const formData = new FormData()
    formData.append("jobDescription",jobDescription)
    formData.append("selfDescription",selfDescription)
    formData.append("resume",resumeFile)

    const response = await api.post("/api/interview/",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })

    return response.data
}

export const getInterviewReportById = async (interviewID) =>{
    const response = await api.get(`/api/interview/report/${interviewID}`)

    return response.data
}

export const generateMoreInterviewContent = async (interviewID, section) => {
    const response = await api.post(`/api/interview/report/${interviewID}/more`, { section })
    return response.data
}

export const getAllInterviewReports= async ()=>{
    const response = await api.get("/api/interview/")
    return response.data
}

