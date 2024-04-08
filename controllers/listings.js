
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const Review = require('../models/review.js');



module.exports.getallListings = async (req, res) => {
    try {
        const a = await Listing.find({});
        res.render('allListings.ejs', { a });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.addnewListing = (req, res) => {
    res.render('new.ejs');
};





module.exports.addnewListing2 = async (req, res) => {
    try {
        let { title, description, category, price, country, location } = req.body;

        // Forward geocode the location to get coordinates
        let response = await geocodingClient.forwardGeocode({
            query: location,
            limit: 1
        }).send();

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path); // Using cloudinary uploader

        const newListing = new Listing({
            title: title,
            description: description,
            image: {
                filename: result.original_filename,
                url: result.secure_url
            },
            price: price,
            location: location,
            country: country,
            reviews: [],
            user: req.user._id,
            geometry: response.body.features[0].geometry,
            category: category
        });

        await newListing.save();
        req.flash('success', 'Listing added successfully!!')
        res.redirect(`/listings`);
    } catch (err) {
        console.error(err.message);
        req.flash('error', 'Failed to add new listing');
        res.redirect('/listings');
    }
};

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate('user') // Populate the 'user' field
            .populate({
                path: 'reviews',
                populate: { path: 'user' } // Populate the 'user' field within the 'reviews' array
            });
        if (!listing) {
            return res.redirect('/listings');
        }
        // Check if the user field is populated and has the username property
        const ownerUsername = listing.user && listing.user.username ? listing.user.username : 'Unknown';
        res.render('show.ejs', { a: listing, currentUser: req.user, ownerUsername });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};



module.exports.editListing = async (req, res) => {
    try {
        const { id } = req.params;
        const a = await Listing.findById(id);
        res.render('edit.ejs', { a });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports.editListing2 = async (req, res) => {
    try {
        let { title, description, category, price, country, location } = req.body;

        // Forward geocode the location to get coordinates
        let response = await geocodingClient.forwardGeocode({
            query: location,
            limit: 1
        }).send();

        const { id } = req.params;

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path); // Using cloudinary uploader

        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            image: {
                filename: result.original_filename,
                url: result.secure_url
            },
            price: price,
            location: location,
            country: country,
            reviews: [],
            owner: {},
            geometry: response.body.features[0].geometry,
            category: category
        });

        req.flash('success', 'Listing updated successfully!!')
        res.redirect('/listings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the listing and populate its reviews
        const listing = await Listing.findById(id).populate('reviews');

        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }

        // Delete all associated reviews
        await Review.deleteMany({ _id: { $in: listing.reviews } });

        // Now delete the listing
        await Listing.findByIdAndDelete(id);

        req.flash('success', 'Listing and associated reviews deleted successfully');
        res.redirect('/listings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};