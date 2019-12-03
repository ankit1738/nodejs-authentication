var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var {
    User
} = require('../models/user');

router.get("/", (req, res) => {
    res.redirect("/index");
});

router.get("/index", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    var data = req.body;
    User.findOne({email: data.email}, async (err, user) => {
        if(err) res.send("User Does Not Exist");
        else {
            var isPasswordMatch = await bcrypt.compare(data.password, user.password);
            if(!isPasswordMatch) {
                res.send("Invalid Credentials");
            }            
        }
        const token = await user.generateAuthToken();
        var returnUser = {
            _id : user._id,
            email : user.email,
            token : token
        }
        res.send(returnUser);
    })
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {

    let existingUser = await User.findOne({
        email: req.body.email
    });
    if (existingUser) return res.status(400).send("User already registered.");

    var data = req.body;
    var user = new User({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
    });
    user.password = await bcrypt.hash(data.password, 10);
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });
});

module.exports = router;