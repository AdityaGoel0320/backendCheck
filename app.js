// to use env file for storing inportant data
let dotenv = require("dotenv");
dotenv.config({path:"./config.env"})


let cors = require("cors")

// importing important npm packages
let express = require("express");
let app = express();
let port = process.env.PORT || 3000 ; 


// importing database connection ans model 
require("./src/db/conn")
let User= require("./src/model/userSchema")


let cookieParser = require("cookie-parser")
app.use(cookieParser());


// now making website understand data will conme in json 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// cors 
// app.use(cors()) ; 
app.use(cors({
    origin: "https://frontend-check.vercel.app", // Replace with your front-end's URL
    credentials: true, // Include credentials (cookies) in the request
  }));
  


// routing of pages
app.use(require("./src/route/auth"))

app.listen(port, () => {
    console.log(`server connected on port ${port}`)
})