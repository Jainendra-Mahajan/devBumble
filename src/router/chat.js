const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const { Chat } = require("../model/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetId", userAuth, async (req, res) => {
    const { targetId } = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName photoUrl",
        })

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetId],
                messages: []
            });

            await chat.save();
        }
        res.json({ chat })
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})

module.exports = { chatRouter };