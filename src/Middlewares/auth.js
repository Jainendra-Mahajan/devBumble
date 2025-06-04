const jwt = require("jsonwebtoken")
const User = require("../model/user");

const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Token Not Valid");
        }

        const decodeMessage = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodeMessage;

        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User Not found");
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(400).send("Please Login!!")
    }

}

module.exports = { userAuth };