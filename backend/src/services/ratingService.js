const prisma = require('../config/db');

class RatingService {
  async submitOrUpdateRating(userId, storeId, ratingValue, feedbackText = null) {
    // 1. Verify store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      const error = new Error('Store not found.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Upsert rating record enforcing single rating per store per user with optional feedback
    const ratingRecord = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        rating: ratingValue,
        feedback: feedbackText !== undefined ? feedbackText : undefined,
      },
      create: {
        userId,
        storeId,
        rating: ratingValue,
        feedback: feedbackText || null,
      },
    });

    // 3. Compute updated store average rating
    const aggregate = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const averageRating = aggregate._avg.rating
      ? Number(aggregate._avg.rating.toFixed(2))
      : 0;
    const totalRatings = aggregate._count.rating || 0;

    return {
      rating: ratingRecord,
      storeStats: {
        storeId,
        averageRating,
        totalRatings,
      },
    };
  }

  async getUserRating(userId, storeId) {
    const rating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    return rating;
  }
}

module.exports = new RatingService();
