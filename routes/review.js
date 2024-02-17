const express = require('express');
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync")
const Review = require('../models/review.js');
const Listing = require('../models/listing');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const ReviewController = require('../controllers/reviews.js')


// post review route
router.post('/', isLoggedIn, validateReview, wrapAsync(ReviewController.postReview))

// Delete review route
router.delete("/:reviewId", isReviewAuthor, isLoggedIn, wrapAsync(ReviewController.deleteReview))

module.exports = router