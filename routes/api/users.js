const express = require("express");
const auth = require("../../service/middleware/middleware");
const {
    signupUser,
    loginOnUser,
    logoutUser,
    getCurrentUser,
    updateUserSubscription,
} = require("./controllers/manageUsers");

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginOnUser);

router.get("/logout", auth, logoutUser);

router.get("/current", auth, getCurrentUser);

router.patch("/", auth, updateUserSubscription);

module.exports = router;
