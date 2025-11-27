const User = require("../models/user.js");

// register User

module.exports.registerUser = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to India Explorer");
        res.redirect("/explore");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Render Login Form

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

// user LoggedIn

module.exports.loggedIn = async (req, res) => {
  req.flash("success", "Welcome back to your account");
  let redirectUrl = res.locals.redirectUrl || "/explore";
  res.redirect(redirectUrl);
};

// user logout

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/explore");
  });
};
