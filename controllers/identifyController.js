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

module.exports = {checkConnection};