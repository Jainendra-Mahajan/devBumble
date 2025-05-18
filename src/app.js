const express = require("express");
const app = express();
const connectDb = require("./config/database")
const User = require("./model/user");
const { Model } = require("mongoose");
const { validateSignUp } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookie = require("cookie-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const { userAuth } = require("../src/Middlewares/auth")

app.use(express.json());
app.use(cookieParser())

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            //create JWT token and send back cookie
            const token = await user.getJWT();

            res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
            res.send("User Login Successfull!!")
        }
        else {
            throw new Error("Invalid Credentials")
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }


})

app.get("/profile", userAuth, (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error:" + "Session Expired");
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const { firstName } = req.user
        res.send("Connection request sent by " + firstName)
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})


//api for creating a new User
app.post("/signup", async (req, res) => {

    //Most Mongoose methods returns a promise handle error in try catch
    try {
        validateSignUp(req);

        const { firstName, lastName, email, password } = req.body

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const user = new User({ firstName, lastName, email, password: passwordHash })

        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("Unable to add User to Database " + err.message)
    }

})

//api to get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    console.log(userEmail);

    try {
        const user = await User.find({ email: userEmail })

        if (user.length > 0) {
            console.log("User found sucessfully");
            res.send(user);
        }
        else {
            res.status(404).send("User not found!!")
        }

    }
    catch (err) {
        res.status(404).send("User not found!!")
    }
})


app.get("/feed", async (req, res) => {

    try {
        const allUsers = await User.find({});
        if (allUsers.length > 0) {
            res.send(allUsers);
        }
        else {
            res.status(404).send("No User present")
        }
    } catch (err) {
        res.status(404).send("Something went wrong")
    }
})

app.get("/userById", async (req, res) => {
    const userId = req.body._id;
    console.log(userId);

    try {
        const user = await User.findById(userId)

        if (user) {
            console.log("User found sucessfully");
            res.send(user);
        }
        else {
            res.status(404).send("User not found!!")
        }

    }
    catch (err) {
        res.status(404).send("User not found!!")
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body._id;
    // console.log(userId);
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully")

    }
    catch (err) {
        res.status(404).send("Something went wrong!!")
    }
})

//update data with ID
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const updatedData = req.body;

    try {

        const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "skills"];

        const isValidUpdate = Object.keys(updatedData).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isValidUpdate) {
            throw new Error("Update Not Allowed");
        }

        if (updatedData?.skills.length > 10) {
            throw new Error("Maximum 10 Skills are allowed")
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { returnDocument: 'before', runValidators: 'true' });
        res.send("User updated Successfully");
    }
    catch (err) {
        res.status(404).send("Something went wrong " + err.message)
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