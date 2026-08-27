require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/DB/db")
const {connectRedis} = require("./src/config/redis")
// const {resume,selfDescription,jobDescription} = require("./src/services/tem")
// const {generateInterviewReport} = require("./src/services/ai.service")


async function startServer(){
    await connectRedis()
    await connectDB()
    // await generateInterviewReport({resume,selfDescription,jobDescription})
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
}

startServer()