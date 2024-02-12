const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');

const app = express();
const port = 3000;
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to database successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

main(); // Call the main function to establish the database connection


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, '/public')))

// Define routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// index route
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
})

// New Route
app.get('/listings/new', async (req, res) => {
    res.render("listings/new.ejs")
})

//show route
app.get('/listings/:id', async (req, res) => {
    const { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})

// create route
app.post('/listings', async (req, res) => {
    // let {title,description , image , price , location , country} = req.body
    const newListing = new Listing(req.body)
    await newListing.save()
    // console.log(newListing)
    res.redirect("/listings")
})

// edit route
app.get('/listings/:id/edit', async (req, res) => {
    const { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
})

// update route
app.put('/listings/:id', async (req, res) => {
    const { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body })
    res.redirect(`/listings/${id}`)
})

// delete route
app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect(`/listings`)
})

// sample listing
// app.get('/listing', async (req, res) => {
//     try {
//         let sampleListing = new Listing({
//             title: 'My New Villa',
//             description: 'By the beach',
//             price: 1200,
//             location: 'Sawat',
//             country: 'Pakistan'
//         });
//         await sampleListing.save();
//         console.log('Sample listing was saved');
//         res.send('Successful testing');
//     } catch (error) {
//         console.error('Error saving sample listing:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
