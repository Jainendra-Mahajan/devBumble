const socket = require("socket.io");
const crypto = require('crypto');
const { Chat } = require("../model/chat");
const connectionrequest = require("../model/connectionrequest");
const user = require("../model/user");
const onlineUsers = new Map();

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


            onlineUsers.set(userId, {
                socketId: socket?.id,
                firstName: firstName
            })
            io.emit("onlineUsers", Array.from(onlineUsers.entries()));
        });

        socket.on("disconnect", () => {
            for (const [userId, data] of onlineUsers.entries()) {
                if (data.socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }

            io.emit("onlineUsers", Array.from(onlineUsers.entries()));
        })

        //send the receieved message to end party
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetId, text }) => {

            try {
                const roomId = getRoomID({ userId, targetId });

                //check if both the users and friends
                const connectionStatus = await connectionrequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetId, status: "accepted" },
                        { fromUserId: targetId, toUserId: userId, status: "accepted" },
                    ]
                })

                if (connectionStatus) {

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

                    const sender = await user.findById({ _id: userId }).select("photoUrl")

                    io.to(roomId).emit("messageReceived", { firstName, lastName, text, photoUrl: sender?.photoUrl || null });
                }

                else {
                    socket.emit("error", { message: "Connection not accepted between users." });
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        });



    })
}

module.exports = initializeSocket;