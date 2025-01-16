const pool = require("../models/db");

exports.createEvent = async (req, res) => {
  let { name, capacity } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO events (name, capacity) VALUES (?, ?)",
      [name, capacity]
    );

    return res.status(201).json({
      message: "Events created successfully",
      data: {
        id: result.insertId,
        name,
        capacity,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
