const { Flight, Airport, Aircraft, Booking, Ticket, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.getAllFlights = async (req, res) => {
  try {
    const { departureAirportId, arrivalAirportId, date } = req.query;
    const where = {};

    if (departureAirportId) {
        where.departure_airport_id = departureAirportId;
    }
    if (arrivalAirportId) {
        where.arrival_airport_id = arrivalAirportId;
    }
    if (date) {
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 999);
        where.scheduled_departure = {
            [Op.between]: [startDate, endDate]
        };
    }

    const flights = await Flight.findAll({
      where,
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Aircraft, as: 'Aircraft' }
      ],
      order: [['scheduled_departure', 'ASC']]
    });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookedSeats = async (req, res) => {
    try {
        const { id } = req.params;
        const tickets = await Ticket.findAll({
            attributes: ['seat_number'],
            include: [{
                model: Booking,
                as: 'Booking',
                attributes: [],
                where: { 
                    flight_id: id,
                    booking_status: 'confirmed' 
                }
            }],
            where: {
                seat_number: {
                    [Op.ne]: null
                }
            }
        });
        const bookedSeats = tickets.map(t => t.seat_number);
        res.json(bookedSeats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    const newFlight = await Flight.findByPk(flight.flight_id, {
        include: [
            { model: Airport, as: 'departureAirport' },
            { model: Airport, as: 'arrivalAirport' },
            { model: Aircraft, as: 'Aircraft' }
        ]
    });
    res.status(201).json(newFlight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const [updated] = await Flight.update(req.body, { where: { flight_id: req.params.id } });
    if (updated) {
      const updatedFlight = await Flight.findByPk(req.params.id, {
          include: [
            { model: Airport, as: 'departureAirport' },
            { model: Airport, as: 'arrivalAirport' },
            { model: Aircraft, as: 'Aircraft' }
          ]
      });
      res.json(updatedFlight);
    } else {
      res.status(404).json({ error: 'Рейс не найден' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const deleted = await Flight.destroy({ where: { flight_id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Рейс не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};