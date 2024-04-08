const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    category: Joi.string(),
}).required();  // Remove the nested Joi.object and add required to the end

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
}).required(); // Remove the nested Joi.object and add required to the end
