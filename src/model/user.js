const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50

    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter valid Email Id");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter valid Password");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },

    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },

    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if (!validator.isURL(value, { require_protocol: true })) {
                throw new Error("Enter Valid Image Url");
            }
        }
    },

    about: {
        type: String,
        default: "This is a default about of the user!",
    },

    skills: {
        type: [String],

    },
}, {
    timestamps: true,
});


userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "dev@bumble!878", { expiresIn: "7d" });

    return token;
}

userSchema.methods.validatePassword = async function (passwordByUser) {

    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordByUser, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);