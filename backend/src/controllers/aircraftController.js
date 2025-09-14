const { Aircraft } = require('../models');

exports.getAllAircrafts = async (req, res) => {
  try {
    const aircrafts = await Aircraft.findAll({ order: [['model', 'ASC']] });
    res.json(aircrafts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAircraft = async (req, res) => {
  try {
    const aircraft = await Aircraft.create(req.body);
    res.status(201).json(aircraft);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAircraft = async (req, res) => {
  try {
    const [updated] = await Aircraft.update(req.body, { where: { aircraft_id: req.params.id } });
    if (updated) {
      const updatedAircraft = await Aircraft.findByPk(req.params.id);
      res.json(updatedAircraft);
    } else {
      res.status(404).json({ error: 'Aircraft not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAircraft = async (req, res) => {
  try {
    const deleted = await Aircraft.destroy({ where: { aircraft_id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Aircraft not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};