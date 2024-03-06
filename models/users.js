const Jimp = require("jimp");
const {
    newUserAuthSchema,
    loginUserAuthSchema,
    currUserAuthSchema,
    editSubUserAuthSchema,
    checkUserEmailSchema,
} = require("../service/validation/userValidation");
const User = require("../service/schemas/user");
const { sign } = require("jsonwebtoken");

require("dotenv").config();

const path = require("path");
const {
    UPLOAD_DIRECTORY,
} = require("../routes/api/controllers/managePictureUpload");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

const registerUser = async (body) => {
    try {
        if (body.email) body.email = body.email.toLowerCase();
        await newUserAuthSchema.validateAsync(body);
        const user = await User.findOne({ email: body.email });
        if (user) {
            return 409;
        }
        const newUser = new User({
            email: body.email,
            verificationToken: uuidv4(),
        });
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
        if (user && user.validPassword(password) && user.verify === true) {
            const payload = {
                id: user.id,
            };
            const token = sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            const loggedUser = { ...user._doc, token };
            return loggedUser;
        }
        if (user && user.validPassword(password) && user.verify === false) {
            const notVerified = {
                status: 401,
                message: "User has not been verified. Check your address email",
            };
            return notVerified;
        }
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};

const currentUser = async (body) => {
    try {
        if (!body.token) {
            return 400;
        }
        await currUserAuthSchema.validateAsync({ body });
        const user = await User.findOne({ token: body.token });
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

const updateAvatar = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (user) {
            const currentAvatarName = `${user.email}-avatar${path.extname(
                req.file.originalname
            )}`;
            await Jimp.read(`tmp/${req.file.originalname}`).then(function (
                img
            ) {
                img.resize(250, 250).write(
                    `${UPLOAD_DIRECTORY}/${currentAvatarName}`
                );
            });
            const currentAvatarURL = `http://localhost:3000/avatars/${currentAvatarName}`;
            await User.findOneAndUpdate(
                { token: user.token },
                {
                    $set: {
                        avatarURL: currentAvatarURL,
                    },
                }
            );
            user.avatarURL = currentAvatarURL;
            await fs
                .unlink(`tmp/${req.file.originalname}`)
                .catch((err) => console.log(err.message));
            return user;
        }
        return user;
    } catch (err) {
        console.log(err.message);
    }
};
const searchForUser = async (token) => {
    try {
        const { verificationToken } = token;
        const user = await User.findOne({ verificationToken });
        if (user) {
            await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        verificationToken: null,
                        verify: true,
                    },
                }
            );
        }
        return user;
    } catch (err) {
        console.log(err.message);
    }
};

const checkUserEmail = async (email) => {
    try {
        await checkUserEmailSchema.validateAsync({ email });
        const user = await User.findOne({ email });
        if (user && user.verify === false) return user;
        if (user && user.verify === true) return 400;
    } catch (err) {
        if (err.isJoi) {
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
    updateAvatar,
    searchForUser,
    checkUserEmail,
};
