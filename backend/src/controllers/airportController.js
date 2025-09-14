const { Airport } = require('../models');

exports.getAllAirports = async (req, res) => {
  try {
    const airports = await Airport.findAll({
      order: [['airport_name', 'ASC']],
    });
    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};