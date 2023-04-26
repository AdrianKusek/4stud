// const Add = require("../models/add");
const express = require("express");
const router = express.Router();
// const adds = require("../controller/add");
const Message = require("../models/chat/message");
const Channel = require("../models/chat/channel");
const User = require("../models/user");
const chat = require("../controller/chat");

const { isLoggedIn } = require("../middleware");

const AppError = require("../AppError");
const catchAsync = require("../utils/catchAsync");

router
  .route("/:id")
  .get(isLoggedIn, catchAsync(chat.renderChat))
  .post(isLoggedIn, catchAsync(chat.sendMessage));

router
  .route("/")
  .get(isLoggedIn, catchAsync(chat.renderChat))
  .post(isLoggedIn, catchAsync(chat.makeeNewChannal));

module.exports = router;
