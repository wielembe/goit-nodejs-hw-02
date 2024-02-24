const Joi = require("joi");

const newUserAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    subscription: Joi.string().valid("starter", "pro", "business"),
    token: Joi.string(),
});

const loginUserAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
});

const currUserAuthSchema = Joi.object({
    token: Joi.string().required(),
});

const editSubUserAuthSchema = Joi.object({
    token: Joi.string().required(),
    subscription: Joi.string().valid("starter", "pro", "business").required(),
});

module.exports = {
    newUserAuthSchema,
    loginUserAuthSchema,
    currUserAuthSchema,
    editSubUserAuthSchema,
};
