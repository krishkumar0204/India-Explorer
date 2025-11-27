const expressError = require("./util/ExpressError.js");
const { samplePlaces, allReview } = require("./Schema.js");
const ExplorePlaces = require("./models/explore.js");
const Review = require("./models/review.js");

module.exports.validateExplore = (req, res, next) => {
  if (!req.body || !req.body.explore) {
    throw new expressError(400, "Invalid Places Data");
  }
  const { error } = samplePlaces.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  if (!req.body || !req.body.review) {
    throw new expressError(400, "Invalid Review Data");
  }
  const { error } = allReview.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(404, errMsg);
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to add a place");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let explore = await ExplorePlaces.findById(id);
  if (!explore) {
    req.flash("error", "Place not found");
    return res.redirect("/explore");
  }
  if (!explore.owner || !explore.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you aren't the owner of this place");
    return res.redirect(`/explore/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review || !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You aren't the owner of this review");
    return res.redirect(`/explore/${id}`);
  }
  next();
};
