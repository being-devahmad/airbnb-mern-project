const Listing = require("../models/listing");

const index = async (req, res) => {
    try {
        const allListing = await Listing.find({});
        res.render("listings/index.ejs", { allListing });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
}

const renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

const showListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                }
            })
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs", { listing });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
}

const createListing = async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing saved");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
}

const editListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
}

const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
}

const delListing = async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted");
        res.redirect(`/listings`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
}

module.exports = { index, renderNewForm, showListing, createListing, editListing, updateListing, delListing };
