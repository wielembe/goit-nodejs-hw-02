const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const User = require("../schemas/user");

const auth = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).json({
            status: "error",
            code: 401,
            message: "Not authorized",
        });
    }
    if (bearerToken) {
        const token = bearerToken.split(" ")[1];
        try {
            const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: payload.id });
            if (user.token !== token) {
                return res.status(401).json({
                    status: "error",
                    code: 401,
                    message: "Not authorized",
                });
            } else {
                req.user = user;
                next();
            }
        } catch (err) {
            return res.status(500).json({
                status: "failure",
                code: 500,
                message: err.message,
            });
        }
    }
};

module.exports = auth;
