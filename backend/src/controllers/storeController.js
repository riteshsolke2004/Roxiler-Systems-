const storeService = require('../services/storeService');
const { sendSuccess } = require('../utils/response');

class StoreController {
  async getStores(req, res, next) {
    try {
      const { search, sortBy, order } = req.query;
      const userId = req.user ? req.user.id : null;
      const stores = await storeService.getStores({ search, sortBy, order, userId });
      return sendSuccess(res, 200, 'Stores fetched successfully', stores);
    } catch (error) {
      next(error);
    }
  }

  async getStoreById(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const store = await storeService.getStoreById(req.params.id, userId);
      return sendSuccess(res, 200, 'Store details fetched successfully', store);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StoreController();
