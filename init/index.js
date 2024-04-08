
const data = require('./data.js');
const Listing = require('../models/listing.js')

Listing.insertMany(data.data).then((a) => {
    console.log(a)
})
