const express = require("express");
const { userAuth } = require("../Middlewares/auth")
const User = require("../model/user");
const { validateProfileUpdate } = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");


//api to get userProfile
profileRouter.get("/profile", userAuth, (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error:" + "Session Expired");
    }
})

//api to to get user by id
profileRouter.get("/userById", async (req, res) => {
    const userId = req.body._id;
    console.log(userId);

    try {
        const user = await User.findById(userId)

        if (user) {
            console.log("User found sucessfully");
            res.send(user);
        }
        else {
            res.status(404).send("User not found!!")
        }

    }
    catch (err) {
        res.status(404).send("User not found!!")
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileUpdate(req)) {
            throw new Error("Invalid Edit request");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, Your Profile was updated Successfully`,
            data: loggedInUser,
        })

    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const { oldPassword, newPassword } = req.body;

        const isOldPasswordValid = await bcrypt.compare(oldPassword, loggedInUser.password);

        if (!isOldPasswordValid) {
            return res.status(401).send("Old Password not valid")
        }

        if (!newPassword) {
            return res.status(400).send("New password is required");
        }

        loggedInUser.password = await bcrypt.hash(newPassword, 10);
        await loggedInUser.save()

        res.status(200).send("Password Updated Successfully");
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }

})


module.exports = profileRouter;