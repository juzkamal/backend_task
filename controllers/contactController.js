const db = require("../config/db");

const getAllContacts = async (req, res) => {
  try {
    const [contacts] = await db.query("SELECT * FROM contacts");
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllContacts };
