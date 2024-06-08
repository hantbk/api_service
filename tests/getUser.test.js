const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/Users'); 

describe('GET /getUser/:id', () => {
    test('should respond with the user when the user exists', async () => {
        // Tạo một user giả định để kiểm tra
        const mockUser = {
            _id: '6100eef548ed993d48f12d35', // Id của user giả định
            name: 'John Doe',
            email: 'john@example.com',
        };

        // Mock function của findById để trả về user giả định
        UserModel.findById = jest.fn().mockResolvedValue(mockUser);

        // Gửi request GET tới endpoint với id của user giả định
        const response = await request(app).get(`/getUser/${mockUser._id}`);

        // Kiểm tra xem response có chứa user giả định không
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    test('should respond with 404 error when the user does not exist', async () => {
        // Mock function của findById để trả về null, tương đương với không tìm thấy user
        UserModel.findById = jest.fn().mockResolvedValue(null);

        // Gửi request GET tới endpoint với một id ngẫu nhiên
        const response = await request(app).get('/getUser/123456');

        // Kiểm tra xem response có trả về status 404 không
        expect(response.status).toBe(404);
        // Kiểm tra xem response có chứa thông báo lỗi như mong đợi không
        expect(response.body).toEqual({ error: 'User not found' });
    });

    test('should respond with 400 error when there is an error in the server', async () => {
        // Mock function của findById để ném một lỗi bất kỳ
        UserModel.findById = jest.fn().mockImplementationOnce(() => { throw new Error('Server error'); });

        // Gửi request GET tới endpoint với một id ngẫu nhiên
        const response = await request(app).get('/getUser/123456');

        // Kiểm tra xem response có trả về status 400 không
        expect(response.status).toBe(400);
        // Kiểm tra xem response có chứa thông báo lỗi từ server không
        expect(response.body).toEqual({ error: 'Server error' });
    });
});