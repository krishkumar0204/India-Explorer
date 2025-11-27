const express = require("express");
const asyncWrap = require("../util/AsyncWrap.js");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review.js");
const { isLoggedIn,validateReview,isReviewAuthor} = require("../Middleware.js");


router.post("/", isLoggedIn,validateReview, asyncWrap(reviewController.createReview));
router.get("/:reviewId/edit", isLoggedIn, isReviewAuthor, asyncWrap(reviewController.editReviewForm));
router.patch(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  validateReview,
  asyncWrap(reviewController.editReview)
);
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, asyncWrap(reviewController.deleteReview));

module.exports = router;
