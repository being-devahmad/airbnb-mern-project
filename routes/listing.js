const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require('../controllers/listings.js');
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        upload.single('listing[image]'),
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing)
    );


router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
);

router.route("/:id")
    .get(
        wrapAsync(listingController.showListing))
    .put(
        upload.single('listing[image]'),
        isLoggedIn,
        validateListing,
        isOwner,
        wrapAsync(listingController.updateListing))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.delListing))

router.get('/:id/edit',
    isLoggedIn,
    wrapAsync(listingController.editListing));


module.exports = router;
