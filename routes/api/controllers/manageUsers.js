const {
    registerUser,
    loginUser,
    currentUser,
    updateSubscription,
} = require("../../../models/users");
const User = require("../../../service/schemas/user");

const {
    notFoundResponse,
    errorResponse,
    badReqResponse,
    unauthorizedResponse,
} = require("./common");

const signupUser = async (req, res, next) => {
    try {
        const body = {
            email: req.body.email,
            password: req.body.password,
        };
        const result = await registerUser(body);
        if (result && result !== 409 && result.status !== 400) {
            await result.save();
            return res.status(201).json({
                status: "success",
                code: 201,
                data: {
                    user: {
                        email: result.email,
                        subscription: result.subscription,
                    },
                },
            });
        }
        const message = result.message || "Email in use";
        return badReqResponse(res, message);
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const loginOnUser = async (req, res, next) => {
    try {
        const body = {
            email: req.body.email,
            password: req.body.password,
        };
        const result = await loginUser(body);
        if (result && result.status === 400) {
            return badReqResponse(res, result.message);
        }
        if (result && result.status !== 400) {
            await User.updateOne(
                { _id: result._id },
                { $set: { token: result.token } }
            );
            return res.status(200).json({
                status: "success",
                code: 200,
                data: {
                    token: result.token,
                    user: {
                        email: result.email,
                        subscription: result.subscription,
                    },
                },
            });
        } else {
            unauthorizedResponse(res, "Email or password is wrong");
        }
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const logoutUser = async (req, res, next) => {
    if (!req.user.token) {
        return unauthorizedResponse(res, "Not authorized");
    }
    try {
        await User.updateOne(
            { token: req.user.token },
            { $set: { token: null } }
        );
        res.status(200).json({
            status: "success",
            code: 204,
        });
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const { email, subscription, token } = req.user;
        const result = await currentUser(token);
        if (result && result !== 400 && result.status !== 400) {
            return res.status(200).json({
                status: "success",
                code: 200,
                data: { email, subscription },
            });
        }
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const updateUserSubscription = async (req, res, next) => {
    if (!req.user.token) {
        return unauthorizedResponse(res, "Not authorized");
    }
    try {
        const body = {
            token: req.user.token,
            subscription: req.query.subscription,
        };
        const result = await updateSubscription(body);
        if (result && result !== 400 && result.status !== 400) {
            await User.findOneAndUpdate(
                { token: result.token },
                { $set: { subscription: body.subscription } }
            );
            return res.json({
                status: "success",
                code: 200,
                data: {
                    email: result.email,
                    subscription: body.subscription,
                },
            });
        }
        if (result.status === 400 || result === 400) {
            return badReqResponse(
                res,
                result.message || "missing field subscription"
            );
        }
        return notFoundResponse(res, "Not found");
    } catch (err) {
        errorResponse(res, err.message);
    }
};

module.exports = {
    signupUser,
    loginOnUser,
    logoutUser,
    getCurrentUser,
    updateUserSubscription,
};
