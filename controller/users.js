const AppError = require("../AppError");
const User = require("../models/user");
const Add = require("../models/add");

module.exports.index = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};
module.exports.login = (req, res) => {
  // req.flash("success", "Welcome back");

  let redirectUrl = req.session.returnTo || "/adds/search";
  if (redirectUrl.includes("like")) {
    redirectUrl = redirectUrl.replace("like", "");
  }

  req.flash("success", "Welcome back");
  res.redirect(redirectUrl);
  delete req.session.returnTo;
};
module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye");
    res.redirect("/");
  });
};
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({
      username: username,
      email: email,
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to 4stud");
      res.redirect("/adds/search");
    });
  } catch (e) {
    req.flash("error" + e.message);

    res.redirect("/user/register");
  }
};

module.exports.showUser = async function (req, res) {
  const id = req.params.id;
  const user = await User.findById(id).populate("adds");

  if (!user) {
    throw new AppError("Not found", 404);
  }
  res.render("users/showUser", { user });
};
