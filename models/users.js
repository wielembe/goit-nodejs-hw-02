const {
    newUserAuthSchema,
    loginUserAuthSchema,
    currUserAuthSchema,
    editSubUserAuthSchema,
} = require("../service/validation/userValidation");
const User = require("../service/schemas/user");
const { sign } = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (body) => {
    try {
        if (body.email) body.email = body.email.toLowerCase();
        await newUserAuthSchema.validateAsync(body);
        const user = await User.findOne({ email: body.email });
        if (user) {
            return 409;
        }
        const newUser = new User({ email: body.email });
        newUser.setPassword(body.password);
        return newUser;
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};

const loginUser = async (body) => {
    try {
        const { email, password } = body;
        await loginUserAuthSchema.validateAsync(body);
        email.toLowerCase();
        const user = await User.findOne({ email });
        if (user && user.validPassword(password)) {
            const payload = {
                id: user.id,
            };
            const token = sign(payload, process.env.JWT_SECRET);
            const loggedUser = { ...user._doc, token };
            return loggedUser;
        }
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};

const currentUser = async (token) => {
    try {
        if (!token) {
            return 400;
        }
        await currUserAuthSchema.validateAsync({ token });
        const user = await User.findOne({ token });
        return user;
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};

const updateSubscription = async (body) => {
    try {
        if (!body.subscription) {
            return 400;
        } else {
            await editSubUserAuthSchema.validateAsync(body);
            const user = await User.findOne({ token: body.token });
            return user;
        }
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateSubscription,
    currentUser,
};
