const express = require('express');
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createUserSchema, createStoreSchema } = require('../validators');

const router = express.Router();

// Apply auth and admin role check to all admin endpoints
router.use(authenticateToken);
router.use(authorizeRoles('SYSTEM_ADMIN'));

router.get('/dashboard', (req, res, next) => adminController.getDashboardStats(req, res, next));

router.post('/users', validate(createUserSchema), (req, res, next) => adminController.createUser(req, res, next));
router.get('/users', (req, res, next) => adminController.getUsers(req, res, next));
router.get('/users/:id', (req, res, next) => adminController.getUserById(req, res, next));

router.post('/stores', validate(createStoreSchema), (req, res, next) => adminController.createStore(req, res, next));
router.get('/stores', (req, res, next) => adminController.getStores(req, res, next));

module.exports = router;
