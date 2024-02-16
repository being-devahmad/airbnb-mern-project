const express = require('express');
const router = express.Router()
const { listingSchema } = require('../schema.js');
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const Listing = require('../models/listing');

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

// index route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
}))

// New Route
router.get('/new', wrapAsync(async (req, res) => {
    res.render("listings/new.ejs")
}))

//show route
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const listing = await Listing.findById(id).populate("reviews")
    if (!listing) {
        req.flash("error", "Listing not found")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}))

// create route
router.post('/',
    validateListing,
    wrapAsync(async (req, res, next) => {
        console.log(req.body.listing);

        // if (!req.body.listings) {
        //     next(new ExpressError(400, "Send valid data for listings"))
        // }

        // let {title,description , image , price , location , country} = req.body
        const newListing = new Listing(req.body.listing)
        await newListing.save()
        req.flash("success", "New Listing saved")
        // console.log(newListing)
        res.redirect("/listings")
    }))

// edit route
router.get('/:id/edit',
    wrapAsync(async (req, res) => {
        const { id } = req.params
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found")
            res.redirect("/listings")
        }
        res.render("listings/edit.ejs", { listing })
    }))

// update route
router.put('/:id',
    validateListing,
    wrapAsync(async (req, res) => {
        if (!req.body.listing) {
            next(new ExpressError(400, "Send valid data for listing"));
        }
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing updated")
        res.redirect(`/listings/${id}`);
    }));

// delete route
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing deleted")
    // console.log(deletedListing)
    res.redirect(`/listings`)
}))


module.exports = router