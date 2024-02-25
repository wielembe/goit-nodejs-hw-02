const express = require("express");
const auth = require("../../service/middleware/middleware");
const router = express.Router();

const {
    getContactsByFavorite,
    getAllContacts,
    getContactsById,
    postContact,
    deleteContact,
    editContact,
    editContactFavorite,
} = require("./controllers/manageContacts");

router.get("/", auth, getContactsByFavorite);

router.get("/", auth, getAllContacts);
router.get("/:contactId", auth, getContactsById);

router.post("/", auth, postContact);

router.delete("/:contactId", auth, deleteContact);
router.put("/:contactId", auth, editContact);
router.patch("/:contactId/favorite", auth, editContactFavorite);

module.exports = router;
