const express = require('express');
const storeOwnerController = require('../controllers/storeOwnerController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('STORE_OWNER'));

router.get('/dashboard', (req, res, next) => storeOwnerController.getDashboard(req, res, next));
router.get('/ratings', (req, res, next) => storeOwnerController.getRatings(req, res, next));

module.exports = router;
