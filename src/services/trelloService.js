const axios = require('axios');
const config = require('../config/env');

const BASE_URL = config.trello.baseUrl;

// Mapeamento padrão dos IDs das listas para os status
const LIST_STATUS_MAPPING = {
    '682e37657cb05c0db6e299e7': { status: 'Em Análise', step: 1 },
    '677d39b644cdd6e640918e70': { status: 'Em Produção', step: 2 },
    '68d2a6ed12371a9acb58636d': { status: 'Disponível Para Retirada', step: 3 },
    '695ba320126515c9e00d3bbe': { status: 'Finalizado', step: 4 }
};

class TrelloService {
    /**
     * Valida se as credenciais do Trello foram fornecidas.
     */
    validateCredentials(apiKey, token) {
        if (!apiKey || !token) {
            const error = new Error('Credenciais da API do Trello (apiKey e token) não foram configuradas para este usuário.');
            error.statusCode = 400;
            throw error;
        }
    }

    /**
     * Busca os dados detalhados de um pedido/cartão específico no Trello.
     */
    async getOrderData(cardId, { apiKey, token }) {
        this.validateCredentials(apiKey, token);

        try {
            const [cardResponse, actionsResponse, commentsResponse] = await Promise.all([
                axios.get(`${BASE_URL}/cards/${cardId}`, {
                    params: { key: apiKey, token: token, fields: 'name,idList,due,desc,idShort,shortUrl,url' }
                }),
                axios.get(`${BASE_URL}/cards/${cardId}/actions`, {
                    params: { key: apiKey, token: token, filter: 'createCard,updateCard:idList', limit: 1000 }
                }),
                axios.get(`${BASE_URL}/cards/${cardId}/actions`, {
                    params: { key: apiKey, token: token, filter: 'commentCard', limit: 100 }
                })
            ]);

            const card = cardResponse.data;
            const actions = actionsResponse.data;
            const comments = commentsResponse.data;

            const listInfo = LIST_STATUS_MAPPING[card.idList] || { status: 'Status Desconhecido', step: 0 };

            const formatDate = (dateString) => {
                if (!dateString) return '---';
                const date = new Date(dateString);
                return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            };

            const formatDateTime = (dateString) => {
                if (!dateString) return '---';
                const date = new Date(dateString);
                return date.toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            };

            const sortedActions = actions.sort((a, b) => new Date(a.date) - new Date(b.date));
            const listEntryDates = {};

            sortedActions.forEach(action => {
                let targetListId = null;
                if (action.type === 'createCard') {
                    targetListId = action.data.list ? action.data.list.id : null;
                } else if (action.type === 'updateCard' && action.data.listAfter) {
                    targetListId = action.data.listAfter.id;
                }
                if (targetListId && !listEntryDates[targetListId]) {
                    listEntryDates[targetListId] = action.date;
                }
            });

            const sortedComments = comments
                .map(c => ({
                    text: c.data.text,
                    date: formatDateTime(c.date),
                    author: c.memberCreator ? c.memberCreator.fullName : 'Sistema'
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            return {
                id: card.id,
                shortId: card.idShort,
                name: card.name,
                url: card.shortUrl || card.url,
                status: listInfo.status,
                step: listInfo.step,
                dueDate: formatDate(card.due),
                listDates: {
                    1: formatDate(listEntryDates['682e37657cb05c0db6e299e7']),
                    2: formatDate(listEntryDates['677d39b644cdd6e640918e70']),
                    3: formatDate(listEntryDates['68d2a6ed12371a9acb58636d']),
                    4: formatDate(listEntryDates['695ba320126515c9e00d3bbe'])
                },
                comments: sortedComments
            };
        } catch (error) {
            if (error.response) {
                const err = new Error(`Erro na API do Trello (${error.response.status}): ${JSON.stringify(error.response.data)}`);
                err.statusCode = error.response.status;
                throw err;
            }
            throw error;
        }
    }

    /**
     * Lista todos os cartões organizados pelas listas/colunas do quadro do Trello.
     */
    async getBoardColumnsAndCards({ apiKey, token, boardId }) {
        this.validateCredentials(apiKey, token);

        if (!boardId) {
            const error = new Error('ID do quadro (boardId) do Trello não fornecido.');
            error.statusCode = 400;
            throw error;
        }

        try {
            const [listsResponse, cardsResponse] = await Promise.all([
                axios.get(`${BASE_URL}/boards/${boardId}/lists`, {
                    params: { key: apiKey, token: token, fields: 'name,pos,closed' }
                }),
                axios.get(`${BASE_URL}/boards/${boardId}/cards`, {
                    params: { key: apiKey, token: token, fields: 'name,idList,shortUrl,url,due,closed' }
                })
            ]);

            const lists = listsResponse.data.filter(l => !l.closed);
            const cards = cardsResponse.data.filter(c => !c.closed);

            // Agrupa os cartões por lista/coluna
            const columns = lists.map(list => {
                const listCards = cards
                    .filter(card => card.idList === list.id)
                    .map(card => ({
                        id: card.id,
                        name: card.name,
                        shortUrl: card.shortUrl || card.url,
                        due: card.due || null
                    }));

                return {
                    listId: list.id,
                    listName: list.name,
                    totalCards: listCards.length,
                    cards: listCards
                };
            });

            return {
                boardId,
                totalColumns: columns.length,
                columns
            };
        } catch (error) {
            if (error.response) {
                const err = new Error(`Erro na API do Trello ao buscar colunas (${error.response.status}): ${JSON.stringify(error.response.data)}`);
                err.statusCode = error.response.status;
                throw err;
            }
            throw error;
        }
    }
}

module.exports = new TrelloService();
