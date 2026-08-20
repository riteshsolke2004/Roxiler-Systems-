const storeOwnerService = require('../services/storeOwnerService');
const { sendSuccess } = require('../utils/response');

class StoreOwnerController {
  async getDashboard(req, res, next) {
    try {
      const data = await storeOwnerService.getOwnerDashboard(req.user.id);
      return sendSuccess(res, 200, 'Store Owner dashboard fetched successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getRatings(req, res, next) {
    try {
      const ratings = await storeOwnerService.getOwnerRatings(req.user.id);
      return sendSuccess(res, 200, 'Store ratings fetched successfully', ratings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StoreOwnerController();
