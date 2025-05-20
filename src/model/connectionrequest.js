const mongoose = require("mongoose");

const connnectionRequestSchema = mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} has a Invalid Status type`
        }
    }
}, { timestamps: true })

connnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connnectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    //check if toUserId is same as from UserID
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot Send Connection request to Yourself")
    }

    next();
})

module.exports = mongoose.model("ConnectionRequest", connnectionRequestSchema);
