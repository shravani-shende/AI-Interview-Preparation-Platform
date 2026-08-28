const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { redisClient } = require("../config/redis")

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({
            message: "provide the all the required information"
        })
    }

    const userAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (userAlreadyExists) {
        return res.status(401).json({
            message: "user already exists.."
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
        message: "user succesfully created.",
        token
    })

}

async function login(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(401).json({
            message: "user does not exists.."
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "password is incorrect "
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "user logged in.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            token: token
        }
    })

}

async function logOut(req, res) {
    const token = req.authToken || req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "user unauthorized."
        })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const currentTime = Math.floor(Date.now() / 1000)

    const remainingTime = decode.exp - currentTime

    if (remainingTime > 0) {
        await redisClient.set(
            `blacklist:${token}`,
            "true",
            { EX: remainingTime }
        )
    }

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production"
    });
    return res.status(200).json({
        message: "user loged out successfully.."
    })
}

async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({
            meassage: err.meassage
        })
    }
}


module.exports = { registerUserController, login, logOut, getMe }