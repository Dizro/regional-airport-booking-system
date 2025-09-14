const { Booking, Ticket, Flight, Airport, User, Sequelize, sequelize } = require('../models');
const { Op } = Sequelize;

exports.getBookings = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { search } = req.query;

    let where = {};
    if (role === 'user') {
      where.user_id = userId;
    }

    let searchConditions = {};
    if ((role === 'cashier' || role === 'admin') && search) {
        searchConditions[Op.or] = [
            { booking_reference: { [Op.iLike]: `%${search}%` } },
            Sequelize.where(Sequelize.col('"Tickets"."passenger_full_name"'), { [Op.iLike]: `%${search}%` }),
            Sequelize.where(Sequelize.col('"Flight"."flight_number"'), { [Op.iLike]: `%${search}%` })
        ];
    }
    
    const bookings = await Booking.findAll({
      where: { ...where, ...searchConditions },
      include: [
        { model: Ticket, as: 'Tickets' },
        {
          model: Flight, as: 'Flight',
          include: [
            { model: Airport, as: 'departureAirport' },
            { model: Airport, as: 'arrivalAirport' }
          ]
        },
        { model: User, as: 'customer', attributes: ['user_id', 'full_name', 'email'] }
      ],
      order: [['created_at', 'DESC']],
      distinct: true,
      subQuery: false
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, userId } = req.user;

        const booking = await Booking.findByPk(id, {
            include: [
                { model: Ticket, as: 'Tickets' },
                {
                    model: Flight, as: 'Flight',
                    include: [
                        { model: Airport, as: 'departureAirport' },
                        { model: Airport, as: 'arrivalAirport' },
                        { model: Aircraft, as: 'Aircraft' }
                    ]
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }

        if (role === 'user' && booking.user_id !== userId) {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { flight_id, user_id, total_cost, tickets } = req.body;

    const seatsToBook = tickets
        .map(t => t.seat_number)
        .filter(seat => seat);

    if (seatsToBook.length > 0) {
        const existingTickets = await Ticket.findAll({
            where: { seat_number: { [Op.in]: seatsToBook } },
            include: [{
                model: Booking,
                as: 'Booking',
                where: {
                    flight_id: flight_id,
                    booking_status: 'confirmed'
                },
                required: true
            }],
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (existingTickets.length > 0) {
            const takenSeat = existingTickets[0].seat_number;
            throw new Error(`Место ${takenSeat} на этом рейсе уже забронировано.`); 
        }
    }
    
    const booking = await Booking.create({
      booking_reference: Math.random().toString(36).substr(2, 8).toUpperCase(),
      user_id: user_id || null,
      cashier_id: req.user.userId,
      flight_id,
      total_cost,
      booking_status: 'confirmed',
    }, { transaction });

    const ticketPromises = tickets.map(ticket => Ticket.create({ ...ticket, booking_id: booking.booking_id }, { transaction }));
    await Promise.all(ticketPromises);
    
    await transaction.commit();

    const newBooking = await Booking.findByPk(booking.booking_id, {
      include: [{ model: Ticket, as: 'Tickets' }]
    });
    
    res.status(201).json(newBooking);

  } catch (error) {
    await transaction.rollback();
    if (error.message.includes('уже забронировано')) {
        return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const { flight_id, total_cost, tickets } = req.body;
        const booking = await Booking.findByPk(id, { transaction });
        if (!booking) throw new Error('Бронирование не найдено');

        const seatsToBook = tickets
            .map(t => t.seat_number)
            .filter(seat => seat);

        if (seatsToBook.length > 0) {
            const existingTickets = await Ticket.findAll({
                where: {
                    seat_number: { [Op.in]: seatsToBook },
                    booking_id: { [Op.ne]: id } 
                },
                include: [{
                    model: Booking,
                    as: 'Booking',
                    where: { flight_id: flight_id, booking_status: 'confirmed' }
                }],
                transaction,
                lock: transaction.LOCK.UPDATE
            });
            if (existingTickets.length > 0) {
                throw new Error(`Место ${existingTickets[0].seat_number} уже занято.`);
            }
        }
        
        await Booking.update({ total_cost }, { where: { booking_id: id }, transaction });

        await Ticket.destroy({ where: { booking_id: id }, transaction });
        const ticketPromises = tickets.map(ticket => Ticket.create({ ...ticket, booking_id: id }, { transaction }));
        await Promise.all(ticketPromises);

        await transaction.commit();
        res.json({ message: 'Бронирование успешно обновлено' });
    } catch (error) {
        await transaction.rollback();
        if (error.message.includes('уже занято')) {
             return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.requestBookingCancellation = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
        if (booking.user_id !== req.user.userId) return res.status(403).json({ error: 'Доступ запрещен' });

        booking.booking_status = 'cancellation_requested';
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.processBookingCancellation = async (req, res) => {
    try {
        const { action } = req.body;
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
        if (booking.booking_status !== 'cancellation_requested') return res.status(400).json({ error: 'Бронь не ожидает обработки отмены' });
        
        booking.booking_status = action === 'confirm' ? 'cancelled' : 'confirmed';
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.forceCancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });

        booking.booking_status = 'cancelled';
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}