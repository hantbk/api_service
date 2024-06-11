const mongoose = require('mongoose');
const User = require('../models/user.model');
const userService = require('../services/user.service');

jest.mock('../models/user.model');

describe('User Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ name: 'John' }, { name: 'Jane' }];
      User.find.mockResolvedValue(mockUsers);

      const users = await userService.getAllUsers();
      expect(users).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if something goes wrong', async () => {
      User.find.mockRejectedValue(new Error());

      await expect(userService.getAllUsers()).rejects.toThrow('Internal server error');
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = { name: 'John' };
      User.findById.mockResolvedValue(mockUser);

      const user = await userService.getUserById('123');
      expect(user).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith('123');
    });

    it('should throw an error if something goes wrong', async () => {
      User.findById.mockRejectedValue(new Error());

      await expect(userService.getUserById('123')).rejects.toThrow('Internal server error');
    });
  });

  describe('createUser', () => {
    it('should throw an error if something goes wrong', async () => {
      User.prototype.save = jest.fn().mockRejectedValue(new Error());

      await expect(userService.createUser('John', 'male', 'ABC School')).rejects.toThrow('Internal server error');
    });
  });

  describe('updateUser', () => {
    it('should throw an error if something goes wrong', async () => {
      User.findById.mockRejectedValue(new Error());

      await expect(userService.updateUser('123', 'John', 'male', 'ABC School')).rejects.toThrow('Internal server error');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const mockUser = { name: 'John', remove: jest.fn().mockResolvedValue(true) };
      User.findById.mockResolvedValue(mockUser);

      const user = await userService.deleteUser('123');
      expect(user).toEqual(mockUser);
      expect(mockUser.remove).toHaveBeenCalled();
    });

    it('should throw an error if something goes wrong', async () => {
      User.findById.mockRejectedValue(new Error());

      await expect(userService.deleteUser('123')).rejects.toThrow('Internal server error');
    });
  });
});
