const Listing = require("../models/listing");

const postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success", "Review posted")

    res.redirect(`/listings/${listing._id}`)
}

const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params

    // remove that reviewId from Listing 
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })

    await Review.findByIdAndDelete(reviewId) // remove review from reviews array
    req.flash("success", "Review deleted")
    res.redirect(`/listings/${id}`)
}


module.exports = { postReview, deleteReview }