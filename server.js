const express = require("express");
const { checkConnection, identifyContact } = require("./controllers/identifyController");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/check-db", checkConnection);
app.post("/identify", identifyContact);


if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}


module.exports = app;