const Joi = require("joi");

const contactSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().integer().required(),
});

const editContactSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    phone: Joi.number().integer(),
});

const editFavContactSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const contactIsFavoriteSchema = Joi.object({
    favorite: Joi.bool().required(),
});

module.exports = {
    contactSchema,
    editContactSchema,
    editFavContactSchema,
    contactIsFavoriteSchema,
};
