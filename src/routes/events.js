const express = require("express");
const { createEvent } = require("../controllers/eventController");
const validate = require("../middlewares/validate");
const { createEventSchema } = require("../validations/validation");
const router = express.Router();

router.post("/create", validate(createEventSchema), createEvent);

module.exports = router;
