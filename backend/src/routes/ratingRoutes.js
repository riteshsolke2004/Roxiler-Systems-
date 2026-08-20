const express = require('express');
const ratingController = require('../controllers/ratingController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { ratingSchema } = require('../validators');

const router = express.Router({ mergeParams: true });

router.use(authenticateToken);
router.use(authorizeRoles('NORMAL_USER'));

router.post('/', validate(ratingSchema), (req, res, next) => ratingController.submitRating(req, res, next));
router.put('/', validate(ratingSchema), (req, res, next) => ratingController.updateRating(req, res, next));
router.get('/', (req, res, next) => ratingController.getUserRating(req, res, next));

module.exports = router;
