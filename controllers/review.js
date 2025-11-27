const allReviews = require("../models/review.js");
const ExplorePlaces = require("../models/explore.js");

module.exports.createReview = async (req, res, next) => {
  let { id } = req.params;
  const explore = await ExplorePlaces.findById(id);
  if (!explore) {
    return next(new Error("Place not found"));
  }

  // Ensure rating is a valid number (1-5)
  if (!req.body.review.rating || req.body.review.rating === "" || 
      parseInt(req.body.review.rating) < 1 || parseInt(req.body.review.rating) > 5) {
    req.flash("error", "Please select a valid rating (1-5 stars)");
    return res.redirect(`/explore/${id}`);
  }

  // Convert rating to number
  req.body.review.rating = parseInt(req.body.review.rating);

  const newReview = await allReviews(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();

  explore.reviews.push(newReview._id);
  await explore.save();

  res.redirect(`/explore/${id}`);
};

// Edit review Form

module.exports.editReviewForm = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await allReviews.findById(reviewId);
  if (!review) return next(new Error("Review not found"));
  res.render("Review/editReview.ejs", { review, id });
};

// Update review

module.exports.editReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await allReviews.findByIdAndUpdate(reviewId, req.body.review);
  res.redirect(`/explore/${id}`);
};

// Delete Review

module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await ExplorePlaces.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await allReviews.findByIdAndDelete(reviewId);
  res.redirect(`/explore/${id}`);
};
