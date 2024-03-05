const multer = require("multer");
const path = require("path");
const { stat, mkdir } = require("fs/promises");

const UPLOAD_TMP_DIRECTORY = "./tmp";
const UPLOAD_DIRECTORY = path.join("public", "avatars");

stat(UPLOAD_TMP_DIRECTORY).catch(() =>
    mkdir(UPLOAD_TMP_DIRECTORY, { recursive: true })
);
stat(UPLOAD_DIRECTORY).catch(() =>
    mkdir(UPLOAD_DIRECTORY, { recursive: true })
);

const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        cb(null, UPLOAD_TMP_DIRECTORY);
    },
    filename: function (_, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage, limits: { fieldSize: 1024 * 1024 } });

const uploadPicture = upload.single("picture");

module.exports = {
    uploadPicture,
    UPLOAD_DIRECTORY,
};
