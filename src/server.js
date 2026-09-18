const app = require('./app');
const config = require('./config/env');
require('./config/database'); // Inicializa conexão com o SQLite

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Servidor cardTrello rodando com sucesso!`);
    console.log(`📡 URL Base API: http://localhost:${PORT}/api`);
    console.log(`🔐 Rota Registro: http://localhost:${PORT}/api/auth/register`);
    console.log(`🔑 Rota Login: http://localhost:${PORT}/api/auth/login`);
    console.log(`📦 Rotas Trello: http://localhost:${PORT}/api/orders/:cardId`);
    console.log(`📋 Rotas Quadro: http://localhost:${PORT}/api/board/columns`);
    console.log(`====================================================`);
});
