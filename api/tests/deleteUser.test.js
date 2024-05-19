const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const UserModel = require('../models/Users');

// Mocking UserModel
jest.mock('../models/Users')

describe('DELETE /deleteUser/:id', () => {
    beforeAll(async () => {
        // You can connect to a test database here if needed
    });

    afterAll(async () => {
        // Clean up database or close connection
        await mongoose.connection.close();
    });

    it('should delete a user and return the deleted user', async () => {
        const mockUser = {
            _id: '60d21b4967d0d8992e610c85',
            name: 'John Doe',
            email: 'john.doe@example.com'
        };

        // Mocking findByIdAndDelete method
        UserModel.findByIdAndDelete.mockResolvedValue(mockUser);

        const response = await request(app).delete(`/deleteUser/${mockUser._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            _id: mockUser._id,
            name: mockUser.name,
            email: mockUser.email
        }));
    });

    it('should return 404 if user is not found', async () => {
        const userId = '60d21b4967d0d8992e610c86';

        // Mocking findByIdAndDelete method to return null
        UserModel.findByIdAndDelete.mockResolvedValue(null);

        const response = await request(app).delete(`/deleteUser/${userId}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual(expect.objectContaining({
            error: 'User not found'
        }));
    });

    it('should return 400 if there is an error', async () => {
        const userId = 'invalidId';

        // Mocking findByIdAndDelete method to throw an error
        UserModel.findByIdAndDelete.mockRejectedValue(new Error('Invalid user ID'));

        const response = await request(app).delete(`/deleteUser/${userId}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual(expect.objectContaining({
            error: 'Invalid user ID'
        }));
    });
});