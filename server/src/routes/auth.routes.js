const express = require('express');
const router = express.Router();
const { login, logout, refresh, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { loginValidation } = require('../validators/auth.validator');

router.post('/login', validate(loginValidation), login);
router.post('/logout', authenticate, logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);

module.exports = router;
