// listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        filename: String,
        url: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: String
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
