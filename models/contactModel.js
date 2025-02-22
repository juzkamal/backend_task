const db = require("../config/db");

// Fetch contacts with contacts with given email and phone number
async function findContactsByEmailOrPhone(email, phoneNumber) {
    const [contacts] = await db.query(
        "SELECT * FROM contacts WHERE (email = ? OR phoneNumber = ?) AND deletedAt IS NULL ORDER BY createdAt ASC",
        [email, phoneNumber]
    );
    return contacts;
}

// Creates and inserts a new instant into the database
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



module.exports = {
    findContactsByEmailOrPhone,
    createContact,
    findContactsByPrimary,
}