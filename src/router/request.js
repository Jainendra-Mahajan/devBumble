const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const ConnectionRequest = require("../model/connectionrequest");
const User = require("../model/user")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //check for validations
        const ALLOWED_METHODS = ["ignored", "interested"];
        if (!ALLOWED_METHODS.includes(status)) {
            return res.status(400).json({ message: "Invalid Status Type " + status })
        }

        //check if to user is present
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({ message: "User Dosn't Exist" })
        }


        //check if Connection request already Present

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request Already Exist" })
        }


        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });

        const data = await connectionRequest.save();

        res.json({
            message: "Connection request sent Successfully",
            data
        })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        //loggedinuser is same as to user
        //check for correct status

        const ALLOWED_STATUS = ["accepted", "rejected"];
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(404).send("Invalid Status")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).send("Connection Request Not Found!")
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();


        res.json({ message: "Connection request " + status, data });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }

})
module.exports = requestRouter;