import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate,Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const login = () => {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState("")
    const navigate = useNavigate()

    const {loading,handleLogin} = useAuth()

    const handleSubmit = async (e)=>{
       e.preventDefault()
        setError("")
        const loggedIn = await handleLogin({email,password})
        if (loggedIn) {
            navigate("/")
        } else {
            setError("Login failed. Check your email and password.")
        }
    }

    if(loading){
        return (<main><h1>Loading.....</h1></main>)
    }

  return (
    <main >
        <div className="form-container ">
            <h1>Login</h1>
            {error && <p role="alert">{error}</p>}
            <form onSubmit={handleSubmit} >
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=>{setEmail(e.target.value)}} 
                    type="email" id='email'name='email' placeholder='Enter email' />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    onChange={(e)=>{setPassword(e.target.value)}} 
                    type="password" id='password' name='passweord' placeholder='Enter password' />
                </div>

                <button className='button primary-button'>Login</button>
            </form>
            <p >Dont have an account? <Link to={"/register"}>Register  </Link> </p>
        </div>
    </main>
  )
}

export default login
