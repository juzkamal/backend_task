const db = require("../config/db");
const { link } = require("../server");

async function findContactsByEmailOrPhone(email, phoneNumber) {
    const [contacts] = await db.query(
        "SELECT * FROM contacts WHERE (email = ? OR phoneNumber = ?) AND deletedAt IS NULL",
        [email, phoneNumber]
    );
    return contacts;
}

async function createContact(email, phoneNumber, linkedId, linkPrecedence) {
    const [result] = await db.query(
        "INSERT INTO contacts (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [email, phoneNumber, linkedId, linkPrecedence]
    );
    return result.insertId;
}

async function findContactsByPrimary(primaryContactId) {
    const [contacts] = await db.query(
        "SELECT * FROM contacts WHERE linkedId = ? or id = ?",
        [primaryContactId, primaryContactId]
    );
    return contacts;
}

async function updateContactToSecondary(contactId, primaryContactId) {
    await db.query(
        "UPDATE contacts SET linkPrecedence = 'secondary', linkedId = ?, updatedAt = NOW() WHERE id = ?",
        [primaryContactId, contactId]
    );
}


module.exports = {
    findContactsByEmailOrPhone,
    createContact,
    findContactsByPrimary,
    updateContactToSecondary,
}