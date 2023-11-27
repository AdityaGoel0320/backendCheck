let dotenv = require("dotenv");
dotenv.config({ path: "./config.env" })


let mongoose = require("mongoose")

let DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
    console.log("connected to database")


}).catch((error) => {
    console.log("error in connecting to database")
})


module.exports = DB 