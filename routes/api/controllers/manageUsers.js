const {
    registerUser,
    loginUser,
    // currentUser,
    updateSubscription,
    updateAvatar,
    searchForUser,
    checkUserEmail,
} = require("../../../models/users");
const User = require("../../../service/schemas/user");

const {
    notFoundResponse,
    errorResponse,
    badReqResponse,
    unauthorizedResponse,
} = require("./common");
const sendingEmails = require("../../../service/middleware/sendingEmails");

const signupUser = async (req, res, next) => {
    try {
        const body = {
            email: req.body.email,
            password: req.body.password,
        };
        const result = await registerUser(body);
        if (result && result !== 409 && result.status !== 400) {
            await result.save();
            sendingEmails(result.email, result.verificationToken);

            return res.status(201).json({
                status: "success",
                code: 201,
                data: {
                    user: {
                        email: result.email,
                        subscription: result.subscription,
                        avatar: result.avatarURL,
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
        if (result && result.status === 401) {
            return unauthorizedResponse(res, result.message);
        }
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
        const currentUser = req.user;
        if (!currentUser) {
            return res.status(401).json({ message: "Not authorized" });
        }

        res.status(200).json({
            email: currentUser.email,
            subscription: currentUser.subscription,
            avatar: currentUser.avatarURL,
        });
    } catch (error) {
        next(error);
    }
};
// async (req, res, next) => {
//     try {
//         const { email, subscription, token } = req.user;
//         const result = await currentUser(token);
//         if (result && result !== 400 && result.status !== 400) {
//             return res.status(200).json({
//                 status: "success",
//                 code: 200,
//                 data: { email, subscription },
//             });
//         }
//     } catch (err) {
//         errorResponse(res, err.message);
//     }
// };

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

const changeAvatar = async (req, res, next) => {
    if (!req.file) {
        return badReqResponse(res, "Provide image to upload");
    }
    try {
        const result = await updateAvatar(req, res);
        if (result) {
            return res.status(200).json({
                status: "success",
                code: 200,
                avatarURL: result.avatarURL,
            });
        }
        return notFoundResponse(res, "Not found");
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const verifyByToken = async (req, res, next) => {
    try {
        const result = await searchForUser(req.params);
        if (result) {
            return res.status(200).json({
                status: "success",
                code: 200,
                data: "Verification successful",
            });
        }
        return notFoundResponse(res, "User not found");
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const resendVerificationEmail = async (req, res, next) => {
    try {
        const result = await checkUserEmail(req.body.email);
        if (result && result !== 400 && !result.message) {
            sendingEmails(result.email, result.verificationToken);
            return res.status(200).json({
                status: "success",
                code: 200,
                data: "Verification email sent",
            });
        }
        if (result && result.message) {
            return badReqResponse(res, result.message);
        }
        if (result === 400) {
            return badReqResponse(res, "Verification has already been passed");
        }
        return notFoundResponse(res, "User not found");
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
    changeAvatar,
    verifyByToken,
    resendVerificationEmail,
};
