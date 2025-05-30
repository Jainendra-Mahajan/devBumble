const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt")
const { validateSignUp } = require("../utils/validation")


//api for user login
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            //create JWT token and send back cookie
            const token = await user.getJWT();

            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.send(user)
        }
        else {
            throw new Error("Invalid Credentials")
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})


//api for user signup
authRouter.post("/signup", async (req, res) => {

    //Most Mongoose methods returns a promise handle error in try catch
    try {
        validateSignUp(req);

        const { firstName, lastName, email, password } = req.body

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ firstName, lastName, email, password: passwordHash })

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
        res.send(user)

        res.json({ message: "User Added successfully!", data: savedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("User Logged out Successfully")
})


module.exports = authRouter;