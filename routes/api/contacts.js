const express = require("express");

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

router.get("/", getContactsByFavorite);

router.get("/", getAllContacts);
router.get("/:contactId", getContactsById);

router.post("/", postContact);

router.delete("/:contactId", deleteContact);
router.put("/:contactId", editContact);
router.patch("/:contactId/favorite", editContactFavorite);

module.exports = router;
