const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/Users');

describe('POST /createUser', () => {
    let userId;

    it('should create a new user', async () => {
        const userData = {
            name: 'Test User',
            gender: 'Male',
            school: 'Test School'
        };

        const res = await request(app)
            .post('/createUser')
            .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toEqual(userData.name);
        expect(res.body.gender).toEqual(userData.gender);
        expect(res.body.school).toEqual(userData.school);

        // Lưu id của user được tạo ra để dọn dẹp sau khi chạy test case
        userId = res.body._id;
    });

    it('should return error if required fields are missing', async () => {
        const userData = {
            // Missing required fields
        };

        const res = await request(app)
            .post('/createUser')
            .send(userData);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    // Dọn dẹp sau mỗi test case
    afterEach(async () => {
        // Nếu userId được tạo ra trong test case trước đó, thì xóa user đó
        if (userId) {
            await UserModel.findByIdAndDelete(userId);
        }
    });
});
