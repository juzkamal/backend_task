const contactModel = require("../models/contactModel")
const db = require("../config/db")
const mysql = require('mysql2/promise');

// end-point to check database connection
async function checkConnection(req, res) {
    try{
        await db.query("SELECT 1");
        res.status(200).json({message: "connectoin successsfull"});
    } catch(error){
        console.error("connection erroor", error);
        res.status(500).json({error: "connection failed"});
    }
    
}

// function for identify endpoint
async function identifyContact(req, res) {
    try {
        const { email, phoneNumber } = req.body;
        if (!email && !phoneNumber) {
            return res.status(400).json({ error: "Email or PhoneNumber required" });
        }

        let contacts = await contactModel.findContactsByEmailOrPhone(email, phoneNumber);
        
        if (contacts.length > 0) {
            // Find the first contact with these details (chronologically)
            let firstContact = contacts[0];
            contacts.forEach((c) => {
                if (c.createdAt < firstContact.createdAt) {
                    firstContact = c;
                }
            });

            // Create new secondary contact linked to the first contact
            const newContactId = await contactModel.createContact(
                email, 
                phoneNumber, 
                firstContact.id, 
                "secondary"
            );

            // Fetch all contacts including the newly created one
            contacts = await contactModel.findContactsByPrimary(firstContact.id);

            const emails = [...new Set(contacts.map((c) => c.email).filter(Boolean))];
            const phoneNumbers = [...new Set(contacts.map((c) => c.phoneNumber).filter(Boolean))];
            const secondaryContactIds = contacts
                .filter((c) => c.linkPrecedence === "secondary")
                .map((c) => c.id);

            return res.status(200).json({
                primaryContactId: firstContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            });
        } else {
            // Create new primary contact if no existing contacts found
            const newContactId = await contactModel.createContact(
                email, 
                phoneNumber, 
                null, 
                "primary"
            );

            return res.status(200).json({
                primaryContactId: newContactId,
                emails: email ? [email] : [],
                phoneNumbers: phoneNumber ? [phoneNumber] : [],
                secondaryContactIds: [],
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}


module.exports = {checkConnection, identifyContact};