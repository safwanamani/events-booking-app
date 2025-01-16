const express = require("express");
const router = express.Router();

const eventRouter = require("./events");

router.use("/events", eventRouter);

module.exports = router;
