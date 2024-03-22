if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listingRoute = require("./Routes/listing.js");
const reviewRoute = require("./Routes/review.js");
const userRoute = require("./Routes/userRoute.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const cors_proxy = require('cors-anywhere');
import fetch from 'node-fetch';

const dbUrl = process.env.ATLASDB_URL;

main().then(() => console.log("connected with db"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

// Set up cors-anywhere proxy server
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8081; // Use a different port than your main server

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
}).listen(port, host, () => {
  console.log(`CORS Anywhere server is running on ${host}:${port}`);
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store= MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*3600
});

store.on("error", ()=>{
  console.log("ERROR in mongo session store", error);
});

const sessionOption = {
  store,
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized : true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7*24*60*60*1000,
    httpOnly: true
  }
};

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use ((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get('/',  async(req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
});

app.get("/terms", (req, res) =>{
  res.render("terms-privacy/terms.ejs")
});

app.get("/privacy", (req, res) =>{
  res.render("terms-privacy/privacy.ejs")
});

app.get("/myjson", (req, res) => {
  const jsonData = require("./views/myjson/features.json");
  res.json(jsonData);
});

app.get("/myjson", (req, res) => {
  const proxyUrl = `http://${host}:${port}`;
  const targetUrl = 'https://havenlly.onrender.com/myjson';
  const proxyRequestUrl = `${proxyUrl}/${targetUrl}`;
  
  fetch(proxyRequestUrl) // Assuming you have 'fetch' available
    .then(response => response.json())
    .then(jsonData => res.json(jsonData))
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);



app.all("*", (req, res, next)=>{
  next(new expressError(404, "page not found"));
});

app.use((err, req, res, next)=>{
  let {statusCode = 500, message= "something went wrong"} = err;
  res.status(statusCode).render("error.ejs", {err});
});


app.listen(8080, () =>{
    console.log("port is listening on 8080");
});
