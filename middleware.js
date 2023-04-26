module.exports.isLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl;

  if (!req.isAuthenticated()) {
    req.flash("error", "You have to be logged in");
    return res.redirect("/login");
  }
  next();
};
