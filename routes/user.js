const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../util/AsyncWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../Middleware.js");
const userController = require("../controllers/user.js");

//render signup form route and user register route

router
  .route("/signup")
  .get((req, res) => {
    res.render("user/signup.ejs");
  })
  .post(asyncWrap(userController.registerUser));

// render login form route and login route

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(saveRedirectUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);

      // USER NOT FOUND
      if (!user) {
        // If username does NOT exist
        if (info?.name === "IncorrectUsernameError") {
          req.flash(
            "error",
            "You don't have an account — please sign up first!"
          );
          return res.redirect("/signup");
        }

        // If password is wrong
        req.flash("error", info.message || "Incorrect password");
        return res.redirect("/login");
      }

      // User exists → log them in
      req.logIn(user, (err) => {
        if (err) return next(err);
        return userController.loggedIn(req, res);
      });
    })(req, res, next);
  });

// logout route

router.get("/logout", userController.logout);

module.exports = router;
