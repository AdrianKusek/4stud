const User = require("../models/user");
const express = require("express");
const router = express.Router();
const users = require("../controller/users");
const AppError = require("../AppError");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

//
//get all users not needed
// router.route("/").get(isLoggedIn, users.index);
router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo:true ,
    }),
    
    users.login
  );

router.route("/logout").get(users.logout);

router.route("/user/:id").get(users.showUser);

module.exports = router;
