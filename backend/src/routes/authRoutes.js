const express = require('express');
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { registerSchema, loginSchema, changePasswordSchema } = require('../validators');

const router = express.Router();

router.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res, next));
router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/logout', authenticateToken, (req, res, next) => authController.logout(req, res, next));
router.put('/change-password', authenticateToken, validate(changePasswordSchema), (req, res, next) => authController.changePassword(req, res, next));
router.get('/me', authenticateToken, (req, res, next) => authController.getMe(req, res, next));

module.exports = router;
