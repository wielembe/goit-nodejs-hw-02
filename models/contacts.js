const {
    contactSchema,
    editContactSchema,
    editFavContactSchema,

    contactIsFavoriteSchema,
} = require("../service/validation/contactValidation");
const Contact = require("../service/schemas/contact");

// const listContacts = async (user) => {
//     try {
//         const { _id: owner } = user;
//         return await Contact.find({ owner });
//     } catch (err) {
//         console.log(err.message);
//     }
// };

const listContacts = async (ownerId) => {
    try {
        const contacts = await Contact.find({ owner: ownerId });
        return contacts;
    } catch (error) {
        console.log(error.message);
    }
};
const getContactById = async (contactId, ownerId) => {
    try {
        return await Contact.findOne({ _id: contactId, owner: ownerId });
    } catch (err) {
        console.log(err.message);
    }
};

const removeContact = async (contactId, ownerId) => {
    try {
        return await Contact.findByIdAndDelete({
            _id: contactId,
            owner: ownerId,
        });
    } catch (err) {
        console.log(err.message);
    }
};

const addContact = async (body, ownerId) => {
    try {
        await contactSchema.validateAsync(body);

        body.email = body.email.toLowerCase();

        const contacts = await Contact.create({ ...body, owner: ownerId });
        return contacts;
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            return err;
        }
        console.log(err.message);
    }
};

const updateContact = async (contactId, body, ownerId) => {
    try {
        const { name, email, phone, owner } = body;
        if (!name && !email && !phone && !owner) {
            const result = 400;
            return result;
        } else {
            await editContactSchema.validateAsync(body);

            if (body.email) body.email = body.email.toLowerCase();
            return Contact.findByIdAndUpdate(
                { _id: contactId },
                { $set: body },
                { owner: ownerId },
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

const updateStatusContact = async (contactId, body, ownerId) => {
    try {
        if (!body.favorite) {
            const result = 400;
            return result;
        } else {
            await editFavContactSchema.validateAsync(body);
            return Contact.findByIdAndUpdate(
                { _id: contactId, owner: ownerId },
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
