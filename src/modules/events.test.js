const { plugin: eventsPlugin } = require('./events');
const config = require('../config/config.json');
describe('Events Plugin', () => {
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

    test('GET /events', async () => {
        await eventsPlugin.register(server, options);

        expect(server.route).toHaveBeenCalledWith(expect.objectContaining({
            method: 'GET',
            path: '/events'
        }));

        expect(server.route).toHaveBeenCalledWith(expect.objectContaining({
            method: 'GET',
            path: '/events/{id}'
        }));
    });
    test('GET /events/{id}', async () => {
        await eventsPlugin.register(server, options);

        expect(server.route).toHaveBeenCalledWith(expect.objectContaining({
            method: 'GET',
            path: '/events/{id}'
        }));
    });

    test('GET /events should return events list', async () => {
        const mockRows = [
            { id: 1, name: 'Event 1', total_seats: 100 },
            { id: 2, name: 'Event 2', total_seats: 50 }
        ];

        pool.query.mockResolvedValue([mockRows]);

        await eventsPlugin.register(server, options);
        const getRoute = server.route.mock.calls[0][0];
        const result = await getRoute.handler();

        expect(result).toEqual({ err: [200, "Успех"], data: mockRows });
    });

    test('GET /events/{id} should return specific event', async () => {
        const mockEvent = [{ id: 1, name: 'Test Event', total_seats: 100 }];
        pool.query.mockResolvedValue([mockEvent]);

        await eventsPlugin.register(server, options);
        const getByIdRoute = server.route.mock.calls[1][0];

        const request = { params: { id: '1' } };
        const result = await getByIdRoute.handler(request);

        expect(result).toEqual({ err: [200, "Успех"], data: mockEvent });
    });
});