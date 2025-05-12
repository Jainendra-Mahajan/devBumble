const express = require("express");
const app = express();

app.get("/user", (req, res) => {
    res.send({ "FirstName": "Jainendra", "LastName": "Mahajan" });
});

app.post("/user", (req, res) => {
    res.send("Data saved successfully");
});

app.patch("/user", (req, res) => {
    res.send("User updated Successfully");
});

app.delete("/user", (req, res) => {
    res.send("User deleted Successfully");
});

app.listen(7777, () => {
    console.log("Server is running on port 7777")
});