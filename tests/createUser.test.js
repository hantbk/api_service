const request = require('supertest');
const app = require('../server'); // Adjust the path if necessary
const UserModel = require('../models/Users'); // Assuming this is the correct path to your UserModel

describe('POST /createUser', () => {
    test('It should create a new user', async () => {
        const newUser = {
            name: 'Test User',
            gender: 'Male',
            school: 'Test School'
        };

        const res = await request(app)
            .post('/createUser')
            .send(newUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe(newUser.name);

        // Clean up: Delete the user after the test
        await UserModel.findByIdAndDelete(res.body._id);
    });

    test('It should return 400 if missing required fields', async () => {
        const res = await request(app)
            .post('/createUser')
            .send({
                name: 'Test User 2'
            });

        expect(res.statusCode).toBe(400);
    });
});
