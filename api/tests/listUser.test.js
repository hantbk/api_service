const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const UserModel = require('../models/Users');

describe('GET /', () => {
    it('should return list of users', async () => {
        // Arrange
        const expectedUsers = [
            { _id: '1', name: 'User 1' },
            { _id: '2', name: 'User 2' }
        ];
        sinon.stub(UserModel, 'find').resolves(expectedUsers);

        // Act
        const response = await request(app).get('/');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedUsers);

        // Restore the stub
        UserModel.find.restore();
    });

    it('should handle errors', async () => {
        // Arrange
        const errorMessage = 'Internal Server Error';
        sinon.stub(UserModel, 'find').rejects(new Error(errorMessage));

        // Act
        const response = await request(app).get('/');

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: errorMessage });

        // Restore the stub
        UserModel.find.restore();
    });
});