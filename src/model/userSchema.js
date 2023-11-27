let mongoose = require("mongoose")
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")

let userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        work: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        cpassword: {
            type: String,
            required: true,
        },

        Date: {
            type: Date,
            default: Date.now
        },
        messages: [
            {
                name: {
                    type: String,
                    required: true,
                },

                email: {
                    type: String,
                    required: true,
                },
                phone: {
                    type: String,
                    required: true,
                },
                msg: {
                    type: String,
                    required: true,
                },
            }
        ],

        // as token has to be added also
        tokens: [{
            token: {
                type: String,
                required: true,
            }
        }]
    }
)



// now fnc of bcryptjs

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next();
})



// jwt token 

// userSchema.methods.generateAuthToken = async function () {
//     try {


//         let tokenGenerated = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)


//         // now adding this new token in databse

//         this.tokenArray = this.tokenArray.concat({tokenObj:tokenGenerated})
//         await this.save();


//         return tokenGenerated ; 


//     } catch (error) {
//         console.log("error in token fnc in scehma file")
//     }
// }

userSchema.methods.generateAuthToken = async function () {
    try {
        let tokenGenerated = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);

        // Append the new token to the tokenArray
        this.tokens.push({ token: tokenGenerated });

        // Save the updated user object
        await this.save();
        console.log(tokenGenerated)
        return tokenGenerated;
    } catch (error) {
        console.error("Error in generateAuthToken:", error.message);
        throw error; // Propagate the error
    }
}

// userSchema.methods.addMessageToDB = async function (name, email, phone, msg) {
//     try {
//         this.messsages = this.messsages.concat({ name, email, phone, msg })

//         await this.save();
//         return this.messsages  ; 
//     }
//     catch { error } {
//         console.log("erro in storing contact data in DB" + error)
//     }

// }

userSchema.methods.addMessageToDB = async function (name, email, phone, msg) {
    try {
        this.messages = this.messages.concat({ name, email, phone, msg });
        await this.save();
        return this.messages;
    } catch (error) { // Correct the parameter name to capture the error
        console.log("Error in storing contact data in DB: " + error);
        throw error; // It's a good practice to re-throw the error so it can be handled elsewhere
    }
}



let User = new mongoose.model("User", userSchema)

module.exports = User;

