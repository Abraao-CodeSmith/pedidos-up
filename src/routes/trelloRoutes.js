const express = require('express');
const router = express.Router();
const trelloController = require('../controllers/trelloController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota pública para rastreamento de pedidos pelo cliente final
router.get('/public/orders/:cardId', (req, res, next) => trelloController.getPublicOrderCard(req, res, next));

// Rotas protegidas do Trello (exigem cabeçalho Authorization: Bearer <token>)
router.get('/orders/:cardId', authMiddleware, (req, res, next) => trelloController.getOrderCard(req, res, next));
router.get('/board/columns', authMiddleware, (req, res, next) => trelloController.getBoardColumns(req, res, next));

module.exports = router;
