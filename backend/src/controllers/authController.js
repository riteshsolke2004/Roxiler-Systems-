const authService = require('../services/authService');
const { sendSuccess } = require('../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.registerUser(req.body);
      return sendSuccess(res, 201, 'User registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.loginUser(req.body);
      return sendSuccess(res, 200, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      return sendSuccess(res, 200, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await authService.changePassword(req.user.id, req.body);
      return sendSuccess(res, 200, 'Password changed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return sendSuccess(res, 200, 'Current user profile fetched successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
