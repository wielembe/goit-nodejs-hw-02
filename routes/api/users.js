const express = require("express");
const auth = require("../../service/middleware/middleware");
const {
    signupUser,
    loginOnUser,
    logoutUser,
    getCurrentUser,
    updateUserSubscription,
    changeAvatar,
} = require("./controllers/manageUsers");

const { uploadPicture } = require("./controllers/managePictureUpload");

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginOnUser);

router.get("/logout", auth, logoutUser);

router.get("/current", auth, getCurrentUser);

router.patch("/", auth, updateUserSubscription);
router.patch("/avatars", auth, uploadPicture, changeAvatar);

module.exports = router;
