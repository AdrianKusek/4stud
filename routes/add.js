// const Add = require("../models/add");
const express = require("express");
const router = express.Router();
const add = require("../controller/add");
const Add = require("../models/add");
const { isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const AppError = require("../AppError");
const catchAsync = require("../utils/catchAsync");

router.route("/").get(catchAsync(add.showAllAdds));
router
  .route("/new")
  .get(isLoggedIn, add.renderNewAddForm)
  .post(isLoggedIn, upload.array("image"), catchAsync(add.createAdd));

router.route("/search").get(add.renderSearch);

router.route("/:id").get(catchAsync(add.showOneAdd));

router.route("/:id/like").post(isLoggedIn, catchAsync(add.like));
router.route("/:id/unlike").post(catchAsync(add.unlike));

module.exports = router;
