const socket = require("socket.io");
const crypto = require('crypto');
const { Chat } = require("../model/chat");

const getRoomID = ({ userId, targetId }) => {
    return crypto.createHash("sha256").update([userId, targetId].sort().join("_")).digest("hex")
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })

    io.on("connection", (socket) => {

        //Create a room to join participants
        socket.on("joinChat", ({ firstName, userId, targetId }) => {
            const roomId = getRoomID({ userId, targetId })
            socket.join(roomId);
        });

        //send the receieved message to end party
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetId, text }) => {

            try {
                const roomId = getRoomID({ userId, targetId });

                //find the chat if already present
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetId] }
                });

                //create a new chat if not initiated
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetId],
                        messages: []
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    text
                });

                await chat.save();

                io.to(roomId).emit("messageReceived", { firstName, lastName, text });
            } catch (error) {
                console.log(err);
            }
        });



    })
}

module.exports = initializeSocket;