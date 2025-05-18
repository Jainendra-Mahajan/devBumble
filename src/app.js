const express = require("express");
const app = express();
const connectDb = require("./config/database")
const cookieParser = require("cookie-parser");
const authRouter = require("./router/auth")
const profileRouter = require("./router/profile")
const requestRouter = require("./router/request")


app.use(express.json());
app.use(cookieParser())

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


connectDb().then(() => {
    console.log("Connected to DB Successfully");
    app.listen(7777, () => {
        console.log("Server is running on port 7777")
    });
}).catch((err) => {
    console.error("Cannot connect to DB " + err.message);
});