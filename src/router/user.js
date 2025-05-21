const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const ConnectionRequest = require("../model/connectionrequest")
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "about", "skills"]

userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({ message: "Data fetched Successfully", data: connectionRequest })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }

})

userRouter.get("/user/requests/connections", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted", },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((key) => {
            if (key.fromUserId.toString() === loggedInUser._id.toString()) {
                return key.toUserId;
            }

            return key.fromUserId;
        })

        res.json({ data })

    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})


module.exports = { userRouter }