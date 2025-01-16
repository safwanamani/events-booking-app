require("dotenv").config();
const express = require("express");
const routers = require("./src/routes");

const app = express();
app.use(express.json());

app.use("/", routers);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
