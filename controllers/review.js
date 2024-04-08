const Review = require('../models/review.js')
const Listing = require('../models/listing.js')


module.exports.addReview = async (req, res) => {
    const { listingId } = req.params;
    const { rating, comment } = req.body;
    const createdAt = new Date();

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash('error', 'Listing not found!!')
            throw new Error('Listing not found');
        }
        const review = new Review({ comment, rating, createdAt, user: req.user._id });
        await review.save(); // Save the review first
        listing.reviews.push(review); // Push the newly created review to the listing's reviews array
        await listing.save(); // Save the listing with the updated reviews
        req.flash('success', 'Review added successfully!!')
        res.redirect(`/listings/${listingId}`);
    } catch (err) {
        console.error(err);
    }
};


module.exports.deleteReview = async (req, res, next) => {
    const { listingId, reviewId } = req.params;

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).send('Listing not found');
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).send('Review not found');
        }

        // Remove the review reference from the listing
        listing.reviews.pull(reviewId);
        await listing.save();

        // Delete the review document
        await Review.findByIdAndDelete(reviewId);

        req.flash('success', 'Review deleted successfully');
        return res.redirect(`/listings/${listingId}`);
    } catch (err) {
        console.error(err);
        // Pass the error to the error handling middleware
        next(err);
    }
};
