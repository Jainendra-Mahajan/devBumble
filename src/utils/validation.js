const validator = require("validator")

const validateSignUp = (req) => {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("Enter Valid Name")
    }

    else if (!validator.isEmail(email)) {
        throw new Error("Enter Valid Email")
    }

    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter Valid password")
    }
}

const validateProfileUpdate = (req) => {
    const ALLOWEDMETHODS = ["firstName", "lastName", "email", "photoUrl", "skills", "about", "age", "gender"];

    const isEditAllowed = Object.keys(req.body).every(field => ALLOWEDMETHODS.includes(field));
    return isEditAllowed;
}

module.exports = { validateSignUp, validateProfileUpdate }