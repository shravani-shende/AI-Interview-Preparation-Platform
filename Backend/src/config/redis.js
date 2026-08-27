const redis = require("redis");

const redisClient = redis.createClient({
    url:process.env.REDIS_URL,
    socket: {
        reconnectStrategy: false
    }
});

redisClient.on("error",(err)=>{
    console.log("radis error : ",err)
})

async function connectRedis(){
    try {
        await redisClient.connect();
        console.log("redis connected..");
    } catch (error) {
        console.log("Redis unavailable; continuing without Redis.")
    }
}

module.exports={connectRedis,redisClient}