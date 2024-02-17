const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError")

// validate listing
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

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

const isLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
};

const saveRedirectUrl = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to change this listing")
        return res.redirect(`/listings/${id}`);
    }
    next()
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = { isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, isReviewAuthor };
