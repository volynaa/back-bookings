const Joi = require('joi');

exports.plugin = {
    name: 'bookings',
    version: '0.0.1',
    register: async (server,options) => {
        const pool = server.mysql.pool;
        server.route({
            method: 'GET',
            path: '/bookings',
            handler: async () => {
                try {
                    const [rows] = await pool.query('SELECT * FROM bookings');
                    if(rows.length) return {err: options.answer[200], data: rows};
                    else return {err: options.answer[414]};
                } catch (err) {
                    console.log(err);
                    return {err: options.answer[504]};
                }
            },
            options:{
                description: 'Список брони',
                tags: ['api', 'bookings']
            }
        });
        server.route({
            method: 'POST',
            path: '/bookings/reserve',
            handler: async (request) => {
                const {event_id, user_id} = request.payload;
                if (!event_id || !user_id) {
                    return {err: options.answer[400]};
                }

                try {
                    const [events] = await pool.query('SELECT * FROM events WHERE id=?', event_id);
                    if (!events.length) {
                        return {err: options.answer[414]};
                    }

                    const event = events[0];
                    const [existingBookings] = await pool.query('SELECT * FROM bookings WHERE event_id=? AND user_id=?', [event_id, user_id]);
                    if (existingBookings.length) {
                        return {err: options.answer[405], message: 'Пользователь уже забронировал место на это мероприятие'};
                    }

                    const [bookingsCount] = await pool.query('SELECT COUNT(*) as count FROM bookings WHERE event_id=?', event_id);
                    const bookedSeats = bookingsCount[0].count;
                    if (bookedSeats >= event.total_seats) {
                        return {err: options.answer[413]};
                    }
                    const data = new Date();
                    const [result] = await pool.query('INSERT INTO bookings (event_id, user_id, created_at) VALUES (?, ?, ?)', [event_id, user_id, data]);

                    return {err: options.answer[200], rows:[{
                        id: result.insertId,
                        created_at: data
                    }]};

                } catch (err) {
                    console.log(err);
                    return {err: options.answer[504]};
                }
            },
            options:{
                description: 'Забронировать место',
                tags: ['api', 'bookings'],
                validate: {
                    payload: Joi.object({
                        event_id: Joi.number().required()
                            .description('ID мероприятия')
                            .example(1),
                        user_id: Joi.number().required()
                            .description('ID пользователя')
                            .example(1)
                    })
                }
            }
        });
    }
};