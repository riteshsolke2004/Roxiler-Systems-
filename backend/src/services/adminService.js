const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

class AdminService {
  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return { totalUsers, totalStores, totalRatings };
  }

  async createUser({ name, email, password, address, role }) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error('A user with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        address,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getUsers({ name, email, address, role, sortBy = 'name', order = 'asc' }) {
    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role) where.role = role;

    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        ownedStore: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { [sortField]: sortOrder },
    });

    return users;
  }

  async getUserDetails(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        ownedStore: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    let userDetails = { ...user };
    if (user.role === 'STORE_OWNER' && user.ownedStore) {
      const ratings = user.ownedStore.ratings || [];
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(2)) : 0;

      const { ratings: _, ...storeInfo } = user.ownedStore;
      userDetails.store = {
        ...storeInfo,
        averageRating,
        totalRatings,
      };
      delete userDetails.ownedStore;
    }

    return userDetails;
  }

  async createStore({ name, email, address, ownerId }) {
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      include: { ownedStore: true },
    });

    if (!owner) {
      const error = new Error('Specified Store Owner does not exist.');
      error.statusCode = 404;
      throw error;
    }

    if (owner.role !== 'STORE_OWNER') {
      const error = new Error('Selected user role must be STORE_OWNER.');
      error.statusCode = 400;
      throw error;
    }

    if (owner.ownedStore) {
      const error = new Error('This Store Owner is already assigned to another store.');
      error.statusCode = 409;
      throw error;
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return store;
  }

  async getStores({ name, email, address, sortBy = 'name', order = 'asc' }) {
    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

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
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    const formattedStores = stores.map((store) => {
      const totalRatings = store.ratings.length;
      const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(2)) : 0;
      const { ratings: _, ...storeData } = store;
      return {
        ...storeData,
        averageRating,
        totalRatings,
      };
    });

    // Sorting logic (supporting rating sort as well as text fields)
    const validSortFields = ['name', 'email', 'address', 'rating', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const isDesc = order.toLowerCase() === 'desc';

    formattedStores.sort((a, b) => {
      let valA = sortField === 'rating' ? a.averageRating : a[sortField];
      let valB = sortField === 'rating' ? b.averageRating : b[sortField];

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
}

module.exports = new AdminService();
