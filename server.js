const express = require("express");
const { checkConnection } = require("./controllers/identifyController");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/check-db", checkConnection);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));


module.exports = app;