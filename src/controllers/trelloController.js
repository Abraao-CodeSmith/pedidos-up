const trelloService = require('../services/trelloService');
const config = require('../config/env');

class TrelloController {
    /**
     * Busca pública dos dados de um cartão (sem necessidade de estar logado).
     * GET /api/public/orders/:cardId
     */
    async getPublicOrderCard(req, res, next) {
        try {
            const cardId = req.params.cardId || req.query.key;

            if (!cardId) {
                return res.status(400).json({ error: 'ID do cartão/pedido (cardId) é obrigatório.' });
            }

            const apiKey = config.trello.defaultApiKey;
            const token = config.trello.defaultToken;

            const orderData = await trelloService.getOrderData(cardId, { apiKey, token });

            return res.status(200).json(orderData);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca os dados de um cartão específico do Trello do usuário logado.
     * GET /api/orders/:cardId
     */
    async getOrderCard(req, res, next) {
        try {
            const cardId = req.params.cardId || req.query.key;

            if (!cardId) {
                return res.status(400).json({ error: 'ID do cartão/pedido (cardId) é obrigatório.' });
            }

            // Utiliza as credenciais do usuário autenticado no banco SQLite
            const apiKey = req.user.trello_api_key || config.trello.defaultApiKey;
            const token = req.user.trello_token || config.trello.defaultToken;

            const orderData = await trelloService.getOrderData(cardId, { apiKey, token });

            return res.status(200).json(orderData);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista os cartões organizados por listas/colunas do quadro do Trello do usuário logado.
     * GET /api/board/columns
     */
    async getBoardColumns(req, res, next) {
        try {
            const apiKey = req.user.trello_api_key || config.trello.defaultApiKey;
            const token = req.user.trello_token || config.trello.defaultToken;
            const boardId = req.user.trello_board_id || config.trello.defaultBoardId;

            const columnsData = await trelloService.getBoardColumnsAndCards({ apiKey, token, boardId });

            return res.status(200).json(columnsData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TrelloController();
