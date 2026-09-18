import api from './api';

export const trelloService = {
  // Busca todas as colunas e cartões do quadro do usuário autenticado
  async getBoardColumns() {
    const response = await api.get('/board/columns');
    return response.data;
  },

  // Busca detalhes de um cartão específico para o usuário logado
  async getOrderCard(cardId) {
    const response = await api.get(`/orders/${cardId}`);
    return response.data;
  },

  // Busca pública do pedido para o cliente final (sem necessidade de estar logado)
  async getPublicOrderCard(cardId) {
    try {
      const response = await api.get(`/public/orders/${cardId}`);
      return response.data;
    } catch (err) {
      // Fallback para a rota legada /api/order?key=ID se a nova não responder
      const fallbackRes = await api.get(`/order?key=${cardId}`);
      return fallbackRes.data;
    }
  }
};
