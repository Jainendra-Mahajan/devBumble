const express = require("express");
const app = express();
const connectDb = require("./config/database")
const User = require("./model/user");

app.use(express.json());

app.post("/signup", async (req, res) => {

    const user = new User(req.body)

    //Most Mongoose methods returns a promise handle error in try catch
    try {
        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("Unable to add User to Database " + err.message)
    }

})

connectDb().then(() => {
    console.log("Connected to DB Successfully");
    app.listen(7777, () => {
        console.log("Server is running on port 7777")
    });
}).catch((err) => {
    console.error("Cannot connect to DB");
});