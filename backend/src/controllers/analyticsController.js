const { Booking, Flight, Ticket, User, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.getSalesReport = async (req, res) => {
    try {
        const sales = await Booking.findAll({
            where: {
                created_at: {
                    [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                },
                booking_status: { [Op.ne]: 'cancelled' }
            },
            attributes: [
                [Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at')), 'date'],
                [Sequelize.fn('sum', Sequelize.col('total_cost')), 'total_sales']
            ],
            group: ['date'],
            order: [['date', 'ASC']]
        });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLoadReport = async (req, res) => {
    try {
        const load = await Flight.findAll({
            attributes: [
                'flight_number',
                [Sequelize.col('Aircraft.capacity'), 'capacity'],
                [Sequelize.fn('COUNT', Sequelize.col('Bookings.Tickets.ticket_id')), 'booked_seats']
            ],
            include: [{
                model: Booking,
                as: 'Bookings',
                attributes: [],
                where: { booking_status: { [Op.ne]: 'cancelled' } },
                required: false,
                include: [{
                    model: Ticket,
                    as: 'Tickets',
                    attributes: []
                }]
            }, {
                model: Aircraft,
                as: 'Aircraft',
                attributes: [],
            }],
            group: ['Flight.flight_id', 'Aircraft.aircraft_id'],
            order: [['scheduled_departure', 'DESC']],
            limit: 10,
            subQuery: false,
        });
        res.json(load);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCashierActivityReport = async (req, res) => {
    try {
        const activity = await Booking.findAll({
             where: {
                created_at: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
                }
            },
            attributes: [
                [Sequelize.col('cashier.full_name'), 'cashier_name'],
                [Sequelize.fn('COUNT', Sequelize.col('booking_id')), 'bookings_created'],
                [Sequelize.fn('SUM', Sequelize.col('total_cost')), 'total_revenue']
            ],
            include: [{
                model: User,
                as: 'cashier',
                attributes: [],
                where: { user_role: 'cashier' }
            }],
            group: [Sequelize.col('cashier.full_name')],
            order: [[Sequelize.fn('COUNT', Sequelize.col('booking_id')), 'DESC']]
        });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}