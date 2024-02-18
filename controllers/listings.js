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
    res.render("listings/new.ejs");
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
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "New Listing saved");
        res.redirect("/listings");
    } catch (error) {
        console.log(error);
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

        let originalImageUrl = listing.image.url
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")

        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
}

const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { filename, url }
            await listing.save()
        }
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
