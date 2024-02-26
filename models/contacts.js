const {
    contactSchema,
    editContactSchema,
    editFavContactSchema,

    contactIsFavoriteSchema,
} = require("../service/validation/contactValidation");
const Contact = require("../service/schemas/contact");

const listContacts = async (user) => {
    try {
        const { _id: owner } = user;
        return await Contact.find({ owner });
    } catch (err) {
        console.log(err.message);
    }
};

const getContactById = async (contactId) => {
    try {
        return await Contact.findOne({ _id: contactId });
    } catch (err) {
        console.log(err.message);
    }
};

const removeContact = async (contactId, user) => {
    try {
        const { _id: owner } = user;
        return await Contact.find({ owner }).deleteOne({ id: contactId });
        // return await Contact.deleteOne({
        //     _id: contactId,
        // });
    } catch (err) {
        console.log(err.message);
    }
};

const addContact = async (body) => {
    try {
        await contactSchema.validateAsync(body);
        body.email = body.email.toLowerCase();
        return await Contact.create(body);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};

const updateContact = async (contactId, body) => {
    try {
        const { name, email, phone, favorite, owner } = body;
        if (!name && !email && !phone && !favorite && !owner) {
            const result = 400;
            return result;
        } else {
            await editContactSchema.validateAsync(body);

            if (body.email) body.email = body.email.toLowerCase();
            return Contact.findOneAndUpdate(
                { _id: contactId },
                { $set: body },
                { new: true }
            );
        }
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};

const updateStatusContact = async (contactId, body) => {
    try {
        if (!body.favorite) {
            const result = 400;
            return result;
        } else {
            await editFavContactSchema.validateAsync(body);
            return Contact.findOneAndUpdate(
                { _id: contactId },
                { $set: body },
                { new: true }
            );
        }
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};
const getContactByFavorite = async (favorite) => {
    try {
        await contactIsFavoriteSchema.validateAsync({ favorite });
        const contacts = await Contact.find({ favorite });
        return contacts;
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};
module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
    getContactByFavorite,
};
