const prisma = require('../config/db');

class StoreOwnerService {
  async getOwnerDashboard(ownerUserId) {
    const store = await prisma.store.findUnique({
      where: { ownerId: ownerUserId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) {
      const error = new Error('No store associated with this Store Owner account.');
      error.statusCode = 404;
      throw error;
    }

    const totalRatings = store.ratings.length;
    const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(2)) : 0;

    const ratingList = store.ratings.map((r) => ({
      ratingId: r.id,
      rating: r.rating,
      feedback: r.feedback || null,
      ratingDate: r.createdAt,
      userName: r.user.name,
      userEmail: r.user.email,
      userAddress: r.user.address,
    }));

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings,
      },
      ratings: ratingList,
    };
  }

  async getOwnerRatings(ownerUserId) {
    const dashboard = await this.getOwnerDashboard(ownerUserId);
    return dashboard.ratings;
  }
}

module.exports = new StoreOwnerService();
