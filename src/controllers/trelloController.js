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

            const db = require('../config/database');

            // 1. Tentar primeiro com as credenciais padrão do .env se estiverem preenchidas
            if (config.trello.defaultApiKey && config.trello.defaultToken) {
                try {
                    const orderData = await trelloService.getOrderData(cardId, {
                        apiKey: config.trello.defaultApiKey,
                        token: config.trello.defaultToken
                    });
                    return res.status(200).json(orderData);
                } catch (err) {
                    // Se falhar com credencial padrão, tenta os usuários da base
                }
            }

            // 2. Buscar usuários cadastrados no SQLite com credenciais do Trello
            const users = await db.all(
                `SELECT trello_api_key, trello_token FROM users WHERE trello_api_key IS NOT NULL AND trello_token IS NOT NULL`
            );

            for (const user of users) {
                try {
                    const orderData = await trelloService.getOrderData(cardId, {
                        apiKey: user.trello_api_key,
                        token: user.trello_token
                    });
                    return res.status(200).json(orderData);
                } catch (err) {
                    // Tenta o próximo usuário se este não tiver acesso ao cartão
                }
            }

            // Se nenhuma credencial encontrou o cartão
            const error = new Error('Pedido não encontrado ou ID inválido no Trello.');
            error.statusCode = 404;
            throw error;

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
