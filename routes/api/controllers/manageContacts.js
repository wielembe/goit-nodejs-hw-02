const {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact,

    getContactByFavorite,
} = require("../../../models/contacts");
const { notFoundResponse, errorResponse, badReqResponse } = require("./common");

const getContactsByFavorite = async (req, res, next) => {
    if (Object.keys(req.query).length === 0) return next();
    try {
        const result = await getContactByFavorite(req.query.favorite);
        if (result && result.status !== 400) {
            return res.json({
                status: "success",
                code: 200,
                data: result,
            });
        }
        if (result.status === 400) {
            return badReqResponse(res, result.message);
        }
        notFoundResponse(res, "Cannot find any contact");
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const getAllContacts = async (req, res, next) => {
    const ownerId = req.user.id;
    try {
        const contacts = await listContacts(ownerId);
        if (contacts) {
            res.json({
                status: "success",
                code: 200,
                data: contacts,
            });
        }
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const getContactsById = async (req, res, next) => {
    const ownerId = req.user._id;
    try {
        const contact = await getContactById(req.params.contactId, ownerId);
        if (contact) {
            res.json({
                status: "success",
                code: 200,
                data: contact,
            });
        } else {
            notFoundResponse(
                res,
                `Cannot find a contact with id: ${req.params.contactId}`
            );
        }
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const postContact = async (req, res, next) => {
    // const ownerId = req.user._id;
    try {
        const body = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            owner: req.body.user._id,

            // favorite: req.body.favorite || false,
        };

        const result = await addContact(body);

        if (result && result.status !== 400) {
            res.status(201).json({
                status: "success",
                code: 201,
                data: result,
            });
        } else {
            badReqResponse(res, result.message);
        }
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const deleteContact = async (req, res, next) => {
    try {
        const message = await removeContact(req.params.contactId);
        if (message) {
            res.json({
                status: "success",
                code: 200,
                message: message,
            });
        } else {
            notFoundResponse(res, "Not found");
        }
    } catch (err) {
        errorResponse(res, err.message);
    }
};

const editContact = async (req, res, next) => {
    try {
        const body = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            favorite: req.body.favorite,
        };
        const result = await updateContact(req.params.contactId, body);
        if (result && result.status !== 400 && result !== 400) {
            res.json({
                status: "success",
                code: 200,
                data: result,
            });
            return;
        }
        if (!result) {
            notFoundResponse(res, `Not found`);
            return;
        }
        badReqResponse(res, result.message || "Provide a change to make");
    } catch (err) {
        badReqResponse(res, err.message);
    }
};

const editContactFavorite = async (req, res, next) => {
    try {
        const body = {
            favorite: req.query.favorite,
        };
        const result = await updateStatusContact(req.params.contactId, body);
        if (result && result.status !== 400 && result !== 400) {
            res.json({
                status: "success",
                code: 200,
                data: result,
            });
            return;
        }
        if (!result) {
            return notFoundResponse(res, `Not found`);
        }
        badReqResponse(res, result.message || "missing field favorite");
    } catch (err) {
        errorResponse(res, err.message);
    }
};

module.exports = {
    getContactsByFavorite,
    getAllContacts,

    getContactsById,
    postContact,
    deleteContact,
    editContact,
    editContactFavorite,
};
