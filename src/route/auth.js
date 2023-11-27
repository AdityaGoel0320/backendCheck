const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const authenticate = require("../middleware/authenticate");

require("../db/conn");

router.get("/", (req, res) => {
    res.send("Mern Stack Project Home Page");
});

router.get("/register", (req, res) => {

    res.send("register page using get ");
});


router.get("/signin", (req, res) => {
    res.send("Welcome to the sign-in page");
});





router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, work, password, cpassword } = req.body;

        // Checking user didn't leave any field empty
        if (!name || !email || !phone || !work || !password || !cpassword) {
            return res.status(422).json({ error: "Enter all details properly" });
        }

        if (password !== cpassword) {
            return res.status(422).json({ error: "Passwords do not match" });
        } else {
            const userExist = await User.findOne({ email: email });
            if (userExist) {
                return res.status(422).json({ error: "User already registered" });
            }


            const newUserDetails = new User({ name, email, phone, work, password, cpassword });
            await newUserDetails.save();

            return res.status(201).json({ message: "User registered successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in registration" });
    }
});


router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Checking if the given data is not empty
        if (!email || !password) {
            return res.status(400).json({ error: "Enter details properly for sign in" });
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const passwordIsMatch = await bcrypt.compare(password, userLogin.password);

            let loginNewToken = await userLogin.generateAuthToken();

            const cookieOptions = {
                httpOnly: true,
                sameSite: 'strict',
                path: 'http://localhost:3001/', // Set the path as needed for your application
            };
            // now to save this token so we add in cookie in login page
            res.cookie("jwtLogin", loginNewToken, cookieOptions);

            if (!passwordIsMatch) {
                return res.status(400).json({ error: "Invalid credentials wrong password" });
            } else {
                return res.status(200).json({ message: "User logged in successfully" });
            }
        } else {
            return res.status(400).json({ error: "User is not registered" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in signing in" });
    }
});


router.get("/about", authenticate, (req, res) => {
    console.log("about us ka page")
    res.send(req.rootUser)
})


router.get("/getData", authenticate, (req, res) => {
    console.log("get data router is working us ka page")
    res.send(req.rootUser)
})


// router.post("/contact", authenticate, async (req, res) => {
//     console.log("cotnact uis ka page")
//     try {


//         let { name, email, phone, message } = req.body;

//         if (!name || !email || !phone || !message) {
//             console.log("error in data from contact form")
//             return res.json({ "error": "error in data from contact form" })
//         }


//         // now fint that particyular user
//         let userContact = await User.findOne({ _id: req.UserId })
// console.log(userContact)
//         if (userContact) {
//             let userMessage = await userContact.addMessageToDB(name, email, phone, message)

//             await userContact.save() ; 
//             res.status(201).json({"message"  :  "contact form saved in Db"})
//         }
//     } catch (error) {
//         console.log("error in contatc form saving" + error)
//     }
// })

router.post("/contact",authenticate ,  async (req, res) => {
    console.log("Contact form page");
    try {
        let { name, email, phone, msg } = req.body;
        console.log("req body :- " + req.body)
        if (!name || !email || !phone || !msg) {
            console.log("Error in data from contact form");
            return res.status(400).json({ "error": "Error in data from contact form" });
        }
        else{
            console.log("coorect in data from contact form");

        }

        // Now find that particular user
        let userContact = await User.findOne({ _id: req.userId});

        if (userContact) {
            // Add a try-catch block for database operations
            try {
                let userMessage = await userContact.addMessageToDB(name, email, phone, msg);
                await userContact.save();
                res.status(201).json({ "message": "Contact form saved in DB" });
            } catch (error) {
                console.log("Error in contact form saving:", error);
                res.status(500).json({ "error": "Internal Server Error" });
            }
        }
        else{

        }
    } catch (error) {
        console.log("Error in contact form route:", error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});


router.get("/logout" , async(req,res)=>{
    console.log("backedn of logout run")
    res.clearCookie("jwtLogin" , {path : "/"}) ; 
    res.status(200).send("user logout from the app")

})


module.exports = router;

