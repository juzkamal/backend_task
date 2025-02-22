const contactModel = require("../models/contactModel")
const db = require("../config/db")
const mysql = require('mysql2/promise');

async function checkConnection(req, res) {
    try{
        await db.query("SELECT 1");
        res.status(200).json({message: "connectoin successsfull"});
    } catch(error){
        console.error("connection erroor", error);
        res.status(500).json({error: "connection failed"});
    }
    
}

async function identifyContact(req, res) {
    try {
        const { email, phoneNumber } = req.body;
        if (!email && !phoneNumber) {
            return res.status(400).json({ error: "Email or PhoneNumber required" });
        }

        let contacts = await contactModel.findContactsByEmailOrPhone(email, phoneNumber);
        
        // Find the oldest primary contact in the chain
        let primaryContact = contacts.find((c) => c.linkPrecedence === "primary") || contacts[0];

        if (primaryContact) {
            contacts.forEach((c) => {
                if (c.linkPrecedence === "primary" && c.createdAt < primaryContact.createdAt) {
                    primaryContact = c;
                }
            });

            let attempts = 0;
            const MAX_ATTEMPTS = 100;  // Prevent infinite loops
            
            while (primaryContact.linkPrecedence !== "primary") {
                if (attempts++ > MAX_ATTEMPTS) {
                    throw new Error("Max attempts reached while finding primary contact - possible circular reference");
                }
            
                const [rows] = await db.query("SELECT * FROM contacts WHERE id = ?", [primaryContact.linkedId]);
                
                if (!rows || rows.length === 0) {
                    throw new Error(`No contact found with ID ${primaryContact.linkedId}`);
                }
                
                primaryContact = rows[0];
                
                if (!primaryContact.linkedId && primaryContact.linkPrecedence !== "primary") {
                    throw new Error(`Found secondary contact ${primaryContact.id} with no linkedId`);
                }
            }


            // Ensure all secondary contacts point to the correct oldest primary
            for (let contact of contacts) {
                if (contact.id !== primaryContact.id && contact.linkPrecedence === "primary") {
                    await contactModel.updateContactToSecondary(contact.id, primaryContact.id);
                    contact.linkPrecedence = "secondary";
                    contact.linkedId = primaryContact.id;
                }
            }

            // Check if the new email/phoneNumber is already associated
            const isNewEmail = email && !contacts.some((c) => c.email === email);
            const isNewPhone = phoneNumber && !contacts.some((c) => c.phoneNumber === phoneNumber);

            if (isNewEmail || isNewPhone) {
                await contactModel.createContact(email, phoneNumber, primaryContact.id, "secondary");
            }
        } else {
            // Create new primary contact
            primaryContact = {
                id: await contactModel.createContact(email, phoneNumber, null, "primary"),
                email,
                phoneNumber,
            };
        }

        // Fetch all contacts linked to the primary contact
        contacts = await contactModel.findContactsByPrimary(primaryContact.id);

        const emails = [...new Set(contacts.map((c) => c.email).filter(Boolean))];
        const phoneNumbers = [...new Set(contacts.map((c) => c.phoneNumber).filter(Boolean))];
        const secondaryContactIds = contacts.filter((c) => c.linkPrecedence === "secondary").map((c) => c.id);

        return res.status(200).json({
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}


module.exports = {checkConnection, identifyContact};