const express = require("express");
const { createEvent } = require("../controllers/eventController");
const validate = require("../middlewares/validate");
const {
  createEventSchema,
  bookEventSchema,
} = require("../validations/validation");
const { bookEvent } = require("../controllers/bookingController");
const router = express.Router();

router.post("/create", validate(createEventSchema), createEvent);
router.post("/:eventId/book", validate(bookEventSchema), bookEvent);

module.exports = router;
