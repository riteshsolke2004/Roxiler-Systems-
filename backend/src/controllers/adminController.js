const adminService = require('../services/adminService');
const { sendSuccess } = require('../utils/response');

class AdminController {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return sendSuccess(res, 200, 'Admin dashboard statistics fetched successfully', stats);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await adminService.createUser(req.body);
      return sendSuccess(res, 201, 'User created successfully', user);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { name, email, address, role, sortBy, order } = req.query;
      const users = await adminService.getUsers({ name, email, address, role, sortBy, order });
      return sendSuccess(res, 200, 'Users fetched successfully', users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await adminService.getUserDetails(req.params.id);
      return sendSuccess(res, 200, 'User details fetched successfully', user);
    } catch (error) {
      next(error);
    }
  }

  async createStore(req, res, next) {
    try {
      const store = await adminService.createStore(req.body);
      return sendSuccess(res, 201, 'Store created successfully', store);
    } catch (error) {
      next(error);
    }
  }

  async getStores(req, res, next) {
    try {
      const { name, email, address, sortBy, order } = req.query;
      const stores = await adminService.getStores({ name, email, address, sortBy, order });
      return sendSuccess(res, 200, 'Stores fetched successfully', stores);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
