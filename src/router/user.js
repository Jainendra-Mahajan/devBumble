const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const ConnectionRequest = require("../model/connectionrequest")
const userRouter = express.Router();
const User = require("../model/user")

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
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

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

userRouter.get("/feed", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        //find all the connection request status to ignore those in our feed

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({ data: users })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})


module.exports = { userRouter }