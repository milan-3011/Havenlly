const User = require("../models/user.js");

module.exports.renderSignUp = (req, res)=>{
    res.render("Users/signUp.ejs");
}

module.exports.signUp = async (req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to wonderlust!");
            res.redirect("/listings");
        })
        
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup")
    };
}

module.exports.renderLogin = (req, res)=>{
    res.render("Users/login.ejs");
}

module.exports.login = (req, res)=>{
    req.flash("success", "Welcome back to WonderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}