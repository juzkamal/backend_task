const contactModel = require("../models/contactModel")
const db = require("../config/db")

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
    try{
        const {email, phoneNumber} = req.body;
        if(!email && !phoneNumber){
            return res.status(400).json({error: "Email or PhoneNumber required"});
        }

        let contacts = await contactModel.findContactsByEmailOrPhone(email, phoneNumber);

        let primaryContact = contacts.find((c)=> c.linkPrecedence === "primary") || contacts[0];

        if(primaryContact){
            contacts.forEach((c)=>{
                if(c.linkPrecedence === "primary" && c.createdAt < primaryContact.createdAt){
                    primaryContact = c;
                }
            });

            for(let contact of contacts){
                if(contact.id !== primaryContact.id && contact.linkPrecedence === "primary"){
                    await contactModel.updateContactToSecondary(contact.id, primaryContact.id);
                    contact.linkPrecedence = "secondary";
                    contact.linkedId = primaryContact.id;
                }
            }

            const newInfoNotPresent = !contacts.some((c)=>c.email === email || !contacts.some((c)=> c.phoneNumber === phoneNumber));
            if(newInfoNotPresent){
                await contactModel.createContact(email, phoneNumber, primaryContact.id, "secondary");
            }
        }else{
            primaryContact = {
                id: await contactModel.createContact(email, phoneNumber, null, "primary"),
                email,
                phoneNumber,
            };
        }
        contacts = await contactModel.findContactsByPrimary(primaryContact.id);

        const emails = [...new Set(contacts.map((c)=> c.email).filter(Boolean))];
        const phoneNumbers = [...new Set(contacts.map((c)=> c.phoneNumber).filter(Boolean))];
        const secondaryContactIds = contacts.filter((c)=> c.linkPrecedence === 'secondary').map((c)=> c.id);

        return res.status(200).json({
            primaryContactId : primaryContact.id,
            emails, 
            phoneNumbers, 
            secondaryContactIds,
        });
    }catch(error){
        console.error("Error:", error);
        return res.status(500).json({error: 'soemthing went wrong'});
    }
    
}



module.exports = {checkConnection, identifyContact};