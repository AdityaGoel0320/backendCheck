
// const jwt = require("jsonwebtoken");
// const User = require("../model/userSchema");
// // const cookieParser = require("cookie-parser")
// const Authenticate = async (req, res, next) => {
//     try {
//         console.log("first")
//         let tokenFromCookie = req.cookies.jwtLogin;
//         console.log("token" + tokenFromCookie)
//         // let verifyToken = jwt.verify(tokenFromCookie, process.env.SECRET_KEY)

//         // let rootUser = await User.findOne({ _id: verifyToken._id, "tokenArray.tokenObj": tokenFromCookie })



//         // if (!rootUser) {
//         //     throw new Error("user not found")

//         // }

//         // req.tokenFromCookie = tokenFromCookie;
//         // req.rootUser = rootUser;
//         // req.userID = rootUser._id

//         next();
//     } catch (error) {
//         res.status(400).send("unacuthoriuze")
//         console.log(error)
//     }

// }
// module.exports = Authenticate; 

const jwt = require("jsonwebtoken");
const userdb = require("../model/userSchema");
const keysecret = process.env.SECRET_KEY


const authenticate = async (req, res, next) => {

    try {
        // const token = req.headers.authorization;
        const token = req.cookies.jwtLogin;


        // if user find than it give id of user
        const verifytoken = jwt.verify(token, keysecret);

        const rootUser = await userdb.findOne({ _id: verifytoken._id , "tokens.token" : token});

        if (!rootUser) { throw new Error("user not found") }

        // to send data of that user to differnret pages
        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();

    } catch (error) {
        res.status(401).json({ status: 401, message: "Unauthorized no token provide" })
    }
}


module.exports = authenticate