const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const trelloRoutes = require('./trelloRoutes');

router.use('/auth', authRoutes);
router.use('/', trelloRoutes);

module.exports = router;
