const express = require("express");
const app = express();
const connectDb = require("./config/database")
const cookieParser = require("cookie-parser");
const authRouter = require("./router/auth")
const profileRouter = require("./router/profile")
const requestRouter = require("./router/request");
const { userRouter } = require("./router/user");
const cors = require("cors");
const { paymentRouter } = require("./router/payment");
require('dotenv').config()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser())


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);


connectDb().then(() => {
    console.log("Connected to DB Successfully");
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port 7777")
    });
}).catch((err) => {
    console.error("Cannot connect to DB " + err.message);
});