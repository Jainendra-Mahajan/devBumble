const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION);
}

module.exports = connectDb;