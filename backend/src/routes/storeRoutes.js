const express = require('express');
const storeController = require('../controllers/storeController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', (req, res, next) => storeController.getStores(req, res, next));
router.get('/search', (req, res, next) => storeController.getStores(req, res, next));
router.get('/:id', (req, res, next) => storeController.getStoreById(req, res, next));

module.exports = router;
