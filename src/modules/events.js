exports.plugin = {
    name: 'events',
    version: '0.0.1',
    register: async (server,options) => {
        const pool = server.mysql.pool;
        server.route({
            method: 'GET',
            path: '/events',
            handler: async () => {
                try {
                    const [rows] = await pool.query('SELECT * FROM events');
                    if(rows.length) return {err: options.answer[200], data: rows};
                    else return {err: options.answer[414]};
                } catch (err) {
                    console.log(err);
                    return {err: options.answer[504]};
                }
            },
            options:{
                description: 'Список мероприятий',
                tags: ['api', 'events']
            }
        });
        server.route({
            method: 'GET',
            path: '/events/{id}',
            handler: async (request) => {
                const eventId = request.params.id;
                try {
                    const [rows] = await pool.query('SELECT * FROM events WHERE id=?', [eventId]);
                    if(rows.length) return {err: options.answer[200], data: rows};
                    else return {err: options.answer[414]};

                } catch (err) {
                    console.log(err);
                    return {err: options.answer[504]};
                }
            },
            options:{
                description: 'Получить мероприятие по id',
                tags: ['api', 'events']
            }
        });
    }
};