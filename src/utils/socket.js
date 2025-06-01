const socket = require("socket.io");
const crypto = require('crypto');

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
        socket.on("sendMessage", ({ firstName, userId, targetId, text }) => {
            const roomId = getRoomID({ userId, targetId });

            io.to(roomId).emit("messageReceived", { firstName, text });
        });



    })
}

module.exports = initializeSocket;