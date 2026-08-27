import {createBrowserRouter} from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Home from "./features/interview/pages/Home"
import Interview from "./features/interview/pages/interview"
import Protected from "./features/auth/components/Protected"

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Protected><Home/></Protected>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },{
        path:"/interview",
        element:<Protected><Interview/></Protected>
    },{
        path:"/interview/:interviewId",
        element:<Protected><Interview/></Protected>
    }
])