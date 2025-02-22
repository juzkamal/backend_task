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

// passed one test

// async function identifyContact(req, res) {
//     try{
//         const {email, phoneNumber} = req.body;
//         if(!email && !phoneNumber){
//             return res.status(400).json({error: "Email or PhoneNumber required"});
//         }

//         let contacts = await contactModel.findContactsByEmailOrPhone(email, phoneNumber);

//         let primaryContact = contacts.find((c)=> c.linkPrecedence === "primary") || contacts[0];

//         if(primaryContact){
//             contacts.forEach((c)=>{
//                 if(c.linkPrecedence === "primary" && c.createdAt < primaryContact.createdAt){
//                     primaryContact = c;
//                 }
//             });

//             for(let contact of contacts){
//                 if(contact.id !== primaryContact.id && contact.linkPrecedence === "primary"){
//                     await contactModel.updateContactToSecondary(contact.id, primaryContact.id);
//                     contact.linkPrecedence = "secondary";
//                     contact.linkedId = primaryContact.id;
//                 }
//             }

//             const newInfoNotPresent = !contacts.some((c)=>c.email === email || !contacts.some((c)=> c.phoneNumber === phoneNumber));
//             if(newInfoNotPresent){
//                 await contactModel.createContact(email, phoneNumber, primaryContact.id, "secondary");
//             }
//         }else{
//             primaryContact = {
//                 id: await contactModel.createContact(email, phoneNumber, null, "primary"),
//                 email,
//                 phoneNumber,
//             };
//         }
//         contacts = await contactModel.findContactsByPrimary(primaryContact.id);

//         const emails = [...new Set(contacts.map((c)=> c.email).filter(Boolean))];
//         const phoneNumbers = [...new Set(contacts.map((c)=> c.phoneNumber).filter(Boolean))];
//         const secondaryContactIds = contacts.filter((c)=> c.linkPrecedence === 'secondary').map((c)=> c.id);

//         return res.status(200).json({
//             primaryContactId : primaryContact.id,
//             emails, 
//             phoneNumbers, 
//             secondaryContactIds,
//         });
//     }catch(error){
//         console.error("Error:", error);
//         return res.status(500).json({error: 'soemthing went wrong'});
//     }
// }


// passed two tests

// async function identifyContact(req, res) {
//     try {
//         const { email, phoneNumber } = req.body;
//         if (!email && !phoneNumber) {
//             return res.status(400).json({ error: "Email or PhoneNumber required" });
//         }

//         let contacts = await contactModel.findContactsByEmailOrPhone(email, phoneNumber);
//         let primaryContact = contacts.find((c) => c.linkPrecedence === "primary") || contacts[0];

//         if (primaryContact) {
//             contacts.forEach((c) => {
//                 if (c.linkPrecedence === "primary" && c.createdAt < primaryContact.createdAt) {
//                     primaryContact = c;
//                 }
//             });

//             for (let contact of contacts) {
//                 if (contact.id !== primaryContact.id && contact.linkPrecedence === "primary") {
//                     await contactModel.updateContactToSecondary(contact.id, primaryContact.id);
//                     contact.linkPrecedence = "secondary";
//                     contact.linkedId = primaryContact.id;
//                 }
//             }

//             // Fix: Correctly check if new info (email or phone) is missing in the contact list
//             const emailExists = contacts.some((c) => c.email === email);
//             const phoneExists = contacts.some((c) => c.phoneNumber === phoneNumber);
            
//             if (!emailExists || !phoneExists) {
//                 await contactModel.createContact(email, phoneNumber, primaryContact.id, "secondary");
//             }
//         } else {
//             primaryContact = {
//                 id: await contactModel.createContact(email, phoneNumber, null, "primary"),
//                 email,
//                 phoneNumber,
//             };
//         }

//         contacts = await contactModel.findContactsByPrimary(primaryContact.id);

//         const emails = [...new Set(contacts.map((c) => c.email).filter(Boolean))];
//         const phoneNumbers = [...new Set(contacts.map((c) => c.phoneNumber).filter(Boolean))];
//         const secondaryContactIds = contacts.filter((c) => c.linkPrecedence === 'secondary').map((c) => c.id);

//         return res.status(200).json({
//             primaryContactId: primaryContact.id,
//             emails,
//             phoneNumbers,
//             secondaryContactIds,
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ error: 'Something went wrong' });
//     }
// }


// async function identifyContact(req, res) {
//     try {
//         const { email, phoneNumber } = req.body;
//         if (!email && !phoneNumber) {
//             return res.status(400).json({ error: "Email or PhoneNumber required" });
//         }

//         let contacts = await contactModel.findContactsByEmailOrPhone(email, phoneNumber);
        
//         // Find the primary contact, even if the match is found in a secondary contact
//         let primaryContact = contacts.find((c) => c.linkPrecedence === "primary") || contacts[0];

//         if (primaryContact) {
//             contacts.forEach((c) => {
//                 if (c.linkPrecedence === "primary" && c.createdAt < primaryContact.createdAt) {
//                     primaryContact = c;
//                 }
//             });

//             // Ensure all secondary contacts point to the correct primary
//             for (let contact of contacts) {
//                 if (contact.id !== primaryContact.id && contact.linkPrecedence === "primary") {
//                     await contactModel.updateContactToSecondary(contact.id, primaryContact.id);
//                     contact.linkPrecedence = "secondary";
//                     contact.linkedId = primaryContact.id;
//                 }
//             }

//             // Check if the new email/phoneNumber is already associated
//             const isNewEmail = email && !contacts.some((c) => c.email === email);
//             const isNewPhone = phoneNumber && !contacts.some((c) => c.phoneNumber === phoneNumber);

//             if (isNewEmail || isNewPhone) {
//                 await contactModel.createContact(email, phoneNumber, primaryContact.id, "secondary");
//             }
//         } else {
//             // Create new primary contact
//             primaryContact = {
//                 id: await contactModel.createContact(email, phoneNumber, null, "primary"),
//                 email,
//                 phoneNumber,
//             };
//         }

//         // Fetch all contacts linked to the primary contact
//         contacts = await contactModel.findContactsByPrimary(primaryContact.id);

//         const emails = [...new Set(contacts.map((c) => c.email).filter(Boolean))];
//         const phoneNumbers = [...new Set(contacts.map((c) => c.phoneNumber).filter(Boolean))];
//         const secondaryContactIds = contacts.filter((c) => c.linkPrecedence === "secondary").map((c) => c.id);

//         return res.status(200).json({
//             primaryContactId: primaryContact.id,
//             emails,
//             phoneNumbers,
//             secondaryContactIds,
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ error: "Something went wrong" });
//     }
// }

// // Helper function to get primary linked ID
// async function getPrimaryLinkedId(currentId) {
//   let query = `
//     WITH RECURSIVE contact_chain AS (
//       -- Base case: start with the current record
//       SELECT id, linkedId, linkPrecedence
//       FROM contacts
//       WHERE id = ?
      
//       UNION ALL
      
//       -- Recursive case: join with contacts table to follow linkedId chain
//       SELECT c.id, c.linkedId, c.linkPrecedence
//       FROM contacts c
//       INNER JOIN contact_chain cc ON c.id = cc.linkedId
//       WHERE c.linkPrecedence = 'primary'
//     )
//     SELECT id
//     FROM contact_chain
//     WHERE linkPrecedence = 'primary'
//     LIMIT 1;
//   `;

//   const [rows] = await db.query(query, [currentId]);
//   return rows.length > 0 ? rows[0].id : null;
// }

// // Endpoint to add new contact
// async function identifyContact(req, res) {
//   const { phoneNumber, email } = req.body;
  
//   if (!phoneNumber || !email) {
//     return res.status(400).json({ 
//       error: 'Phone number and email are required' 
//     });
//   }

//   try {

//     // Find existing contact with same phone or email
//     const [existingContacts] = await db.query(
//       `SELECT id, linkedId, linkPrecedence 
//        FROM contacts 
//        WHERE phoneNumber = ? OR email = ? 
//        ORDER BY createdAt DESC 
//        LIMIT 1`,
//       [phoneNumber, email]
//     );

//     let newContactData;
//     const timestamp = new Date().toISOString();

//     if (existingContacts.length === 0) {
//       // Create new primary contact if no match found
//       const [result] = await db.query(
//         `INSERT INTO contacts 
//          (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt) 
//          VALUES (?, ?, NULL, 'primary', ?, ?)`,
//         [phoneNumber, email, timestamp, timestamp]
//       );
//       newContactData = {
//         id: result.insertId,
//         linkedId: null,
//         linkPrecedence: 'primary'
//       };
//     } else {
//       // Find primary contact ID
//       const existingContact = existingContacts[0];
//       const primaryId = await getPrimaryLinkedId(existingContact.id);

//       // Create new secondary contact linked to primary
//       const [result] = await db.query(
//         `INSERT INTO contacts 
//          (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt) 
//          VALUES (?, ?, ?, 'secondary', ?, ?)`,
//         [phoneNumber, email, primaryId, timestamp, timestamp]
//       );
//       newContactData = {
//         id: result.insertId,
//         linkedId: primaryId,
//         linkPrecedence: 'secondary'
//       };
//     }

//     await db.commit();
//     res.status(201).json(newContactData);

//   } catch (error) {
//     console.error('Error adding contact:', error);
//     res.status(500).json({ 
//       error: 'Failed to add contact' 
//     });
//   }
// };


async function getPrimaryLinkedId(currentId) {
    let query = `
        WITH RECURSIVE contact_chain AS (
            -- Start with the given contact
            SELECT id, linkedId, linkPrecedence, createdAt
            FROM contacts
            WHERE id = ?

            UNION ALL

            -- Recursively join on linkedId
            SELECT c.id, c.linkedId, c.linkPrecedence, c.createdAt
            FROM contacts c
            INNER JOIN contact_chain cc ON c.id = cc.linkedId
        )
        -- Select the primary contact with the earliest createdAt timestamp
        SELECT id
        FROM contact_chain
        WHERE linkPrecedence = 'primary'
        ORDER BY createdAt ASC
        LIMIT 1;
    `;

    const [rows] = await db.query(query, [currentId]);
    return rows.length > 0 ? rows[0].id : null;
}

async function findPrimaryContact(startId) {
    try {
      
        let currentId = startId;
        const visitedIds = new Set();
        const MAX_ITERATIONS = 100; // Prevent infinite loops
        let iterations = 0;
      // Keep fetching linked records until we find primary
      while (true) {
        const [rows] = await db.query(
          'SELECT id, linkedId, linkPrecedence FROM contacts WHERE id = ?',
          [currentId]
        );
        
        // If no record found, break
        if (rows.length === 0) {
          throw new Error(`No record found for ID: ${currentId}`);
        }
        
        currentRecord = rows[0];
        
        // If we found a primary record, return it
        if (currentRecord.linkPrecedence === 'primary') {
          return currentRecord.id;
        }
        
        // If we have a secondary record but no linkedId, something is wrong
        if (!currentRecord.linkedId) {
          throw new Error(`Secondary record ${currentId} has no linkedId`);
        }
        
        // Move to the linked record
        currentId = currentRecord.linkedId;
      }
    } catch (error) {
      console.error('Error finding primary contact:', error);
      throw error;
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

            // while(primaryContact.linkPrecedence !== "primary"){
            //     primaryContact = db.query("SELECT * FROM contacts WHERE id = ?"),
            //     [primaryContact.id];
            // }

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