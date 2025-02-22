const express = require("express");
const { checkConnection, identifyContact } = require("./controllers/identifyController");
const { getAllContacts } = require("./controllers/contactController");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

app.get("/check-db", checkConnection);
app.post("/identify", identifyContact);
app.get("/contacts", getAllContacts);


if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}


module.exports = app;