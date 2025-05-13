const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://jainendramahajan:gWXBcvjKQMxdlRVE@cluster0.kes0flv.mongodb.net/devBumble");
}

module.exports = connectDb;