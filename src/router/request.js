const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middlewares/auth")


requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const { firstName } = req.user
        res.send("Connection request sent by " + firstName)
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})

module.exports = requestRouter;