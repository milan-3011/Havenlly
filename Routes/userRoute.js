const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userCtrl = require("../controller/userCtrl")

router.route("/signup")
.get(userCtrl.renderSignUp)
.post(wrapAsync(userCtrl.signUp));

router.route("/login")
.get(userCtrl.renderLogin)
.post(saveRedirectUrl,
    passport.authenticate("local", { 
        failureRedirect: "/login", 
        failureFlash: true ,
    }),
    userCtrl.login
);

router.get("/logout", userCtrl.logOut);

module.exports= router;