const adminAuth = (req, res, next) => {
    const token = "xyz";
    if (token === 'xyz') {
        console.log("User Authenticated");
        next();
    }
    else {
        res.status(401).send("Unauthorized Request");
    }
}

const userAuth = (req, res, next) => {
    const token = "xyz";
    if (token === 'xyz') {
        console.log("User Authenticated");
        next();
    }
    else {
        res.status(401).send("Unauthorized Request");
    }
}
module.exports = { adminAuth, userAuth };