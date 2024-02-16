const express = require('express');
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing');

// validate Review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    // console.log(result.error)
    if (error) {
        let errMsg = error.details.map((el) => el.message.join(","))
        throw new ExpressError(400, errMsg)
    } else {
        next(error)
    }
}

// post review route
router.post('/',
    validateReview,
    wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id)
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview)

        await newReview.save()
        await listing.save()
        req.flash("success", "Review posted")

        res.redirect(`/listings/${listing._id}`)
    }))

// Delete review route
router.delete("/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params

        // remove that reviewId from Listing 
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })

        await Review.findByIdAndDelete(reviewId) // remove review from reviews array
        req.flash("success", "Review deleted")
        res.redirect(`/listings/${id}`)
    }))

module.exports = router