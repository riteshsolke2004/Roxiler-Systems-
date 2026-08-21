const ratingService = require('../services/ratingService');
const { sendSuccess } = require('../utils/response');

class RatingController {
  async submitRating(req, res, next) {
    try {
      const { storeId } = req.params;
      const { rating, feedback } = req.body;
      const userId = req.user.id;
      const result = await ratingService.submitOrUpdateRating(userId, storeId, rating, feedback);
      return sendSuccess(res, 201, 'Rating submitted successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateRating(req, res, next) {
    try {
      const { storeId } = req.params;
      const { rating, feedback } = req.body;
      const userId = req.user.id;
      const result = await ratingService.submitOrUpdateRating(userId, storeId, rating, feedback);
      return sendSuccess(res, 200, 'Rating updated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getUserRating(req, res, next) {
    try {
      const { storeId } = req.params;
      const userId = req.user.id;
      const rating = await ratingService.getUserRating(userId, storeId);
      return sendSuccess(res, 200, 'User rating retrieved', rating);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();
