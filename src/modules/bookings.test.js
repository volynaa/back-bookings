const { plugin: bookingsPlugin } = require('./bookings');
const config = require('../config/config.json');
describe('bookings', () => {
    let server;
    let pool;
    const options = {
        answer: config.answers
    };

    beforeEach(() => {
        pool = {
            query: jest.fn()
        };

        server = {
            mysql: { pool },
            route: jest.fn()
        };
    });

    test('GET /bookings', async () => {
        await bookingsPlugin.register(server, options);

        expect(server.route).toHaveBeenCalledWith(expect.objectContaining({
            method: 'GET',
            path: '/bookings'
        }));

    });

    test('POST /bookings/reserve', async () => {
        await bookingsPlugin.register(server, options);

        expect(server.route).toHaveBeenCalledWith(expect.objectContaining({
            method: 'POST',
            path: '/bookings/reserve'
        }));
    });

    test('GET /bookings should return bookings list', async () => {
        const mockRows = [
            { id: 1, event_id: 1, user_id: 1, created_at: new Date() },
            { id: 2, event_id: 1, user_id: 2, created_at: new Date() }
        ];

        pool.query.mockResolvedValue([mockRows]);

        await bookingsPlugin.register(server, options);
        const getRoute = server.route.mock.calls[0][0];
        const result = await getRoute.handler();

        expect(result).toEqual({ err: [200, "Успех"], data: mockRows });
    });
});