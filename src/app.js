const express = require("express");
const app = express();
const connectDb = require("./config/database")
const User = require("./model/user");

app.post("/signup", async (req, res) => {

    //created a new instance of the user model.
    const user = new User({
        firstName: "Jainendra",
        lastName: "Mahajan",
        email: "test@test.com",
        password: "Test1234"
    })

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