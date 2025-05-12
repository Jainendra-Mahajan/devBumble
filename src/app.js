const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./Middlewares/auth")

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res, next) => {
    console.log("User is accessed");
    res.send("Hello User from Server")
})

app.get("/admin/getAllUserData", (req, res, next) => {
    console.log("Handler 1");
    res.send("All data has been sent");
});

app.post("/admin/addData", (req, res, next) => {
    console.log("Handler 2");
    res.send("All data added");
});

app.delete("/admin/deleteData", (req, res, next) => {
    console.log("Handler 3");
    res.send("Data Deleted");
});

app.listen(7777, () => {
    console.log("Server is running on port 7777")
});