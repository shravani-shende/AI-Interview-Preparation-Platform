import { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const Home = () => {
    const {loading,generateReport,reports}= useInterview()
    const { handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport= async()=>{
        const data = await generateReport({jobDescription,selfDescription,resumeFile})
        if (data) {
            navigate(`/interview/${data._id}`)
        }
    }

    const handleUserLogout = async () => {
        await handleLogout()
        navigate('/login')
    }
    
    if(loading){
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan..</h1>
            </main>
        )
    }

    return (
        <main className="home">
            <section className="home__content" aria-labelledby="page-title">
                <header className="home__header">
                    <div className="home__topbar">
                        <p className="home__eyebrow">Interview intelligence / 01</p>
                        <button className="logout-button" type="button" onClick={handleUserLogout}>Log out</button>
                    </div>
                    <h1 id="page-title">Create Your Custom <span>Interview Plan</span></h1>
                    <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
                </header>

                <div className="interview-input-group">
                    <div className="left">
                        <div className="section-heading">
                            <span className="section-heading__icon" aria-hidden="true">+</span>
                            <label htmlFor="jobDescription">Target Job Description</label>
                            <span className="required">Required</span>
                        </div>
                        <textarea onChange={(e)=>{setJobDescription(e.target.value)}} name="jobDescription" id="jobDescription" placeholder={'Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'}></textarea>
                        <span className="character-count">0 / 5000 chars</span>
                    </div>

                    <div className="right">
                        <div className="section-heading">
                            <span className="section-heading__icon" aria-hidden="true">●</span>
                            <span>Your Profile</span>
                        </div>

                        <div className="input-group input-group--resume">
                            <p className="field-label">Upload Resume <small>Best Results</small></p>
                            <label className={`file-label ${resumeFile ? 'file-label--selected' : ''}`} htmlFor="file">
                                <span className="upload-icon" aria-hidden="true">↑</span>
                                <span className='textsize'>{resumeFile ? resumeFile.name : 'Click to upload or drag & drop'}</span>
                                <span>{resumeFile ? 'Resume selected' : 'PDF or DOCX (Max 5MB)'}</span>
                            </label>
                            <input hidden ref={resumeInputRef} id="file" type="file" name="resume" accept=".pdf,.docx" onChange={(e) => setResumeFile(e.target.files[0] || null)} />
                        </div>

                        <div className="divider"><span>OR</span></div>

                        <div className="input-group input-group--description">
                            <label className="field-label textsize" htmlFor="selfDescription">Quick Self-Description</label>
                            <textarea onChange={(e)=>{setSelfDescription(e.target.value)}} name="selfDescription" id="selfDescription" placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."></textarea>
                        </div>

                        <div className="notice">
                            <span aria-hidden="true">i</span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                <footer className="home__footer">
                    <span>AI-powered strategy generation <em>/</em> Approx 30s</span>
                    <button onClick={handleGenerateReport} className="button generateButton" type="button"><span aria-hidden="true">✦</span> Generate My Interview Strategy</button>
                </footer>
            </section>

            {reports?.length > 0 && (
                <section className="recent-reports" aria-labelledby="recent-reports-title">
                    <div className="recent-reports__header">
                        <div>
                            <p className="home__eyebrow">Your interview history</p>
                            <h2 id="recent-reports-title">My Recent Interview Plans</h2>
                        </div>
                        <span>{reports.length} {reports.length === 1 ? 'plan' : 'plans'}</span>
                    </div>

                    <ul className="reports-list">
                        {reports.map((report) => (
                            <li
                                key={report._id}
                                className="report-item"
                                onClick={() => navigate(`/interview/${report._id}`)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        navigate(`/interview/${report._id}`)
                                    }
                                }}
                                role="button"
                                tabIndex="0"
                            >
                                <div>
                                    <h3>{report.title || 'Untitled Position'}</h3>
                                    <p>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="report-item__score">
                                    {report.matchScore ?? '--'}<small>% match</small>
                                </span>
                                <span className="report-item__arrow" aria-hidden="true">→</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    )
}

export default Home
