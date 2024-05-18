const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/Users');

describe('PUT /updateUser/:id', () => {
    let userId;

    // Tạo một user giả định để kiểm tra
    beforeEach(async () => {
        const user = new UserModel({
            name: 'Initial User',
            gender: 'Male',
            school: 'Initial School'
        });
        const savedUser = await user.save();
        userId = savedUser._id;
    });

    it('should update an existing user', async () => {
        const updatedData = {
            name: 'Updated User',
            gender: 'Female',
            school: 'Updated School'
        };

        const res = await request(app)
            .put(`/updateUser/${userId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toEqual(updatedData.name);
        expect(res.body.gender).toEqual(updatedData.gender);
        expect(res.body.school).toEqual(updatedData.school);
    });

    it('should return 404 if the user does not exist', async () => {
        const nonExistentUserId = '60c72b2f9b1d8e4d88f08f16'; // Một ID không tồn tại trong cơ sở dữ liệu

        const res = await request(app)
            .put(`/updateUser/${nonExistentUserId}`)
            .send({
                name: 'Non-Existent User',
                gender: 'Female',
                school: 'Non-Existent School'
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 if there is a server error', async () => {
        // Mock function của findByIdAndUpdate để ném một lỗi bất kỳ
        UserModel.findByIdAndUpdate = jest.fn().mockImplementationOnce(() => { throw new Error('Server error'); });

        const res = await request(app)
            .put(`/updateUser/${userId}`)
            .send({
                name: 'Updated User',
                gender: 'Female',
                school: 'Updated School'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Server error');
    });

    // Dọn dẹp sau mỗi test case
    afterEach(async () => {
        // Xóa user được tạo ra trong quá trình test
        if (userId) {
            await UserModel.findByIdAndDelete(userId);
        }
    });
});
