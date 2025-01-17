const pool = require("../models/db");

exports.createEvent = async (req, res) => {
  let { name, capacity } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO events (name, capacity) VALUES (?, ?)",
      [name, capacity]
    );

    await connection.commit();
    return res.status(201).json({
      message: "Events created successfully",
      data: {
        id: result.insertId,
        name,
        capacity,
      },
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
