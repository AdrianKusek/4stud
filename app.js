if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const usersRouts = require("./routes/users");
const addsRouts = require("./routes/add");
const chatRouts = require("./routes/messages");

const AppError = require("./AppError");
////FLASH
var flash = require("connect-flash");
app.use(flash());
////END OF FLASH

//PASSPORT

//END OF PASSPORT
/////EJS
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

/////END OF EJS

////BODY PARSER//////
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/////END OF BODY PARSER////
// "mongodb://localhost:27017/yelp-camp";
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("db connected"));

///SESSION
const session = require("express-session");

const MongoStore = require("connect-mongo");

const secret = process.env.SECRET || "thisissecret";

const store = new MongoStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("session store error" + e);
});
const sessionConfig = {
  store: store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

///END OF SESSION

///PASSPORT
const passport = require("passport");
const LocalStrategy = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

///END OF PASSPORT

app.use((req, res, next) => {
  // console.log(req.query);

  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", function (req, res) {
  res.render("index");
});

app.use((err, req, res, next) => {
  const { message = "smt wrong", status = 500 } = err;
  console.log(err);
  res.status(status).send(message);
});
////ROUTES
app.use("/", usersRouts);
app.use("/adds", addsRouts);
app.use("/chat", chatRouts);

///END OF ROUTES

app.listen(27017, () => console.log("serving on 3000"));
