const pool = require("../models/db");
const { sendToQueue } = require("../services/rabbitmqService");
const redisClient = require("../services/redisService");

exports.bookEvent = async (req, res) => {
  let { eventId } = req.params;
  let { userId, userName } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[event]] = await connection.query(
      "SELECT name, capacity FROM events WHERE id = ?",
      [eventId]
    );
    console.log("Event", event);
    if (!event) {
      await connection.rollback();
      return res.status(404).json({ error: "Event not found" });
    }

    //check already book
    const [[existingBooking]] = await connection.query(
      "SELECT id FROM bookings WHERE user_id = ? AND event_id = ? FOR UPDATE",
      [userId, eventId]
    );
    if (existingBooking) {
      await connection.rollback();
      return res.status(400).json({ error: "User already booked" });
    }

    //fetch booking count from redis
    const cachedBookingCount = await redisClient.get(`event-count:${eventId}`);
    const bookingCount = cachedBookingCount
      ? parseInt(cachedBookingCount)
      : (
          await connection.query(
            "SELECT COUNT(*) AS count FROM bookings WHERE event_id = ?",
            [eventId]
          )
        )[0][0].count;

    if (bookingCount >= event.capacity) {
      await connection.rollback();
      return res.status(400).json({ error: "Sorry, event is fully booked" });
    }

    const [result] = await connection.query(
      "INSERT INTO bookings (user_id, event_id) VALUES (?, ?)",
      [userId, eventId]
    );
    await redisClient.set(`event-count:${eventId}`, bookingCount + 1);

    await connection.commit();

    const emailMessage = {
      userName,
      eventName: event.name,
    };
    await sendToQueue(emailMessage);

    return res.status(201).json({
      message: "Successfully booked",
      data: {
        bookingId: result.insertId,
      },
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "User already booked" });
    }
    return res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

exports.getBookingCount = async (req, res) => {
  let { eventId } = req.params;

  try {
    const [[event]] = await pool.query("SELECT id FROM events WHERE id = ?", [
      eventId,
    ]);
    if (!event) {
      return res.status(404).json({
        error: "Event is not found",
      });
    }
    let bookingCount = await redisClient.get(`event-count:${eventId}`);
    if (!bookingCount | (bookingCount == 0)) {
      bookingCount = (
        await pool.query(
          "SELECT COUNT(*) AS count FROM bookings WHERE event_id = ?",
          [eventId]
        )
      )[0][0].count;
      await redisClient.set(`event-count:${eventId}`, bookingCount);
    }

    return res.status(200).json({
      eventId,
      bookingCount: parseInt(bookingCount),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
