const Joi = require("joi");

const samplePlaces = Joi.object({
  explore: Joi.object({
    title: Joi.string().required(),
    brief: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object().optional(),
    info: Joi.string().required(),
    overview: Joi.string().required(),
    visitTime: Joi.string().required(),
    famous: Joi.string().required(),
    place1: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
    place2: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
    place3: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }),
});

const allReview = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});

module.exports = { samplePlaces, allReview };
