// to use env file for storing inportant data
let dotenv = require("dotenv");
dotenv.config({path:"./config.env"})


let cors = require("cors")

// importing important npm packages
let express = require("express");
let app = express();
let port = process.env.PORT || 3000 ; 


// importing database connection ans model 
require("./db/conn")
let User= require("./model/userSchema")


let cookieParser = require("cookie-parser")
app.use(cookieParser());


// now making website understand data will conme in json 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// cors 
// app.use(cors()) ; 
// Enable CORS for a specific origin
app.use(cors({
  origin: 'https://frontend-mern-beryl.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204,  // Set the status code for successful preflight requests
}));



// routing of pages
app.use(require("./route/auth"))

app.listen(port, () => {
    console.log(`server connected on port ${port}`)
})