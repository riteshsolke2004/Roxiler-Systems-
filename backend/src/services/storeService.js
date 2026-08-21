const prisma = require('../config/db');

class StoreService {
  async getStores({ search, sortBy = 'name', order = 'asc', userId }) {
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: true,
      },
    });

    const formattedStores = stores.map((store) => {
      const totalRatings = store.ratings.length;
      const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(2)) : 0;

      // Find current user's rating and feedback if userId is provided
      let userRating = null;
      let userFeedback = null;
      if (userId) {
        const found = store.ratings.find((r) => r.userId === userId);
        if (found) {
          userRating = found.rating;
          userFeedback = found.feedback || null;
        }
      }

      const { ratings: _, ...storeData } = store;
      return {
        ...storeData,
        averageRating,
        totalRatings,
        userRating,
        userFeedback,
      };
    });

    // Sorting
    const isDesc = order.toLowerCase() === 'desc';
    formattedStores.sort((a, b) => {
      let valA = sortBy === 'rating' ? a.averageRating : a[sortBy] || a.name;
      let valB = sortBy === 'rating' ? b.averageRating : b[sortBy] || b.name;

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return isDesc ? 1 : -1;
      if (valA > valB) return isDesc ? -1 : 1;
      return 0;
    });

    return formattedStores;
  }

  async getStoreById(storeId, userId) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: true,
      },
    });

    if (!store) {
      const error = new Error('Store not found.');
      error.statusCode = 404;
      throw error;
    }

    const totalRatings = store.ratings.length;
    const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(2)) : 0;

    let userRating = null;
    let userFeedback = null;
    if (userId) {
      const found = store.ratings.find((r) => r.userId === userId);
      if (found) {
        userRating = found.rating;
        userFeedback = found.feedback || null;
      }
    }

    const { ratings: _, ...storeData } = store;
    return {
      ...storeData,
      averageRating,
      totalRatings,
      userRating,
      userFeedback,
    };
  }
}

module.exports = new StoreService();
