const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const trelloService = require('./services/trelloService');
const config = require('./config/env');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da compilação do React (client/dist) se disponível
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Rota de verificação de status da API
app.get('/api/status', (req, res) => {
    res.json({
        name: 'Pedidos UP API',
        version: '2.0.0',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Registro das rotas da API em /api
app.use('/api', routes);

// Rota legada para renderização visual do Pedido via HTML (/order?key=ID_DO_CARTAO)
app.get('/order', async (req, res, next) => {
    const cardId = req.query.key;
    if (!cardId) {
        return res.status(400).send('ID do pedido não fornecido. Exemplo: /order?key=ID_DO_CARTAO');
    }

    try {
        const apiKey = config.trello.defaultApiKey;
        const token = config.trello.defaultToken;
        const orderData = await trelloService.getOrderData(cardId, { apiKey, token });
        res.send(renderHTML(orderData, cardId));
    } catch (error) {
        console.error('Erro ao buscar pedido:', error.message);
        res.status(500).send('Erro ao carregar os dados do pedido. Verifique se o ID está correto.');
    }
});

// Rota legada da API para atualização da tela HTML
app.get('/api/order', async (req, res, next) => {
    const cardId = req.query.key;
    if (!cardId) return res.status(400).json({ error: 'ID do pedido não fornecido.' });

    try {
        const apiKey = config.trello.defaultApiKey;
        const token = config.trello.defaultToken;
        const orderData = await trelloService.getOrderData(cardId, { apiKey, token });
        res.json(orderData);
    } catch (error) {
        next(error);
    }
});

// Fallback para SPA React (redireciona rotas não-API para o index.html compilado)
app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    const indexPath = path.resolve(__dirname, '../client/dist/index.html');
    res.sendFile(indexPath, (err) => {
        if (err) next();
    });
});

// Middleware Global de Tratamento de Erros
app.use(errorHandler);

// Template HTML legado mantido para compatibilidade visual
function renderHTML(data, cardId) {
    const getStepClass = (stepNumber) => data.step >= stepNumber ? 'step active' : 'step';
    const getIcon = (stepNumber) => data.step >= stepNumber ? '<span class="check">✓</span>' : '';
    const getStepDate = (stepNumber) => {
        const date = data.listDates[stepNumber];
        if (date && date !== '---') return date;
        if (stepNumber === 1) return data.createdDate || '---';
        if (stepNumber === 3 && data.step < 3) return 'Prev. ' + data.dueDate;
        if (stepNumber === 4 && data.step >= 4) return 'Concluído';
        return '---/---/----';
    };

    const renderComments = (comments) => {
        if (!comments || comments.length === 0) {
            return '<p class="no-comments">Nenhum comentário adicionado ainda.</p>';
        }
        return comments.map(c => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${c.author}</span>
                    <span class="comment-date">${c.date}</span>
                </div>
                <div class="comment-text">${c.text.replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');
    };

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acompanhe seu pedido | Pedidos UP</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; color: #e0d4f5; min-height: 100vh; background-color: #0d0618; }
            header { background: rgba(20, 10, 35, 0.8); padding: 18px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(168, 85, 247, 0.2); }
            .logo { font-weight: 700; font-size: 1.3rem; color: #c084fc; }
            .container { max-width: 820px; margin: 40px auto; padding: 0 20px; }
            h1 { text-align: center; color: #e9d5ff; font-weight: 300; font-size: 1.8rem; letter-spacing: 2px; }
            .card-panel { background: rgba(30, 15, 55, 0.7); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 16px; padding: 30px; }
            .order-info { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-bottom: 1px solid rgba(168, 85, 247, 0.2); padding-bottom: 20px; }
            .status-badge { background: rgba(147, 51, 234, 0.2); border: 1px solid rgba(168, 85, 247, 0.4); padding: 8px 14px; border-radius: 8px; color: #d8b4fe; }
            .timeline { position: relative; margin-top: 30px; padding-left: 20px; }
            .timeline::before { content: ''; position: absolute; left: 6px; top: 10px; bottom: 10px; width: 2px; background: #a855f7; }
            .step { position: relative; padding-left: 30px; margin-bottom: 25px; opacity: 0.5; }
            .step.active { opacity: 1; }
            .step::before { content: ''; position: absolute; left: -20px; top: 3px; width: 14px; height: 14px; border-radius: 50%; background: #3b0764; border: 2px solid #a855f7; }
            .step.active::before { background: #a855f7; box-shadow: 0 0 10px #a855f7; }
            .step-title { font-weight: 600; color: #fff; }
            .step-date { font-size: 0.85rem; color: #b794d4; }
            .comments-section { margin-top: 30px; border-top: 1px solid rgba(168, 85, 247, 0.2); padding-top: 20px; }
            .comment { background: rgba(147, 51, 234, 0.1); border-left: 3px solid #a855f7; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; }
            .comment-header { display: flex; justify-content: space-between; font-size: 0.8rem; color: #c084fc; margin-bottom: 4px; }
            .comment-text { font-size: 0.9rem; color: #e9d5ff; }
        </style>
    </head>
    <body>
        <header><div class="logo">Pedidos UP</div></header>
        <div class="container">
            <h1>Acompanhe seu pedido</h1>
            <div class="card-panel">
                <div class="order-info">
                    <div>
                        <h2 style="margin:0; color:#fff;">Pedido: #${data.shortId}</h2>
                        <p style="margin:5px 0; color:#b794d4;">${data.name}</p>
                    </div>
                    <div class="status-badge">Status: <strong>${data.status}</strong></div>
                </div>
                <div class="timeline">
                    <div class="${getStepClass(1)}"><div class="step-title">Em Análise</div><div class="step-date">${getStepDate(1)}</div></div>
                    <div class="${getStepClass(2)}"><div class="step-title">Em Produção</div><div class="step-date">${getStepDate(2)}</div></div>
                    <div class="${getStepClass(3)}"><div class="step-title">Disponível Para Retirada</div><div class="step-date">${getStepDate(3)}</div></div>
                    <div class="${getStepClass(4)}"><div class="step-title">Finalizado</div><div class="step-date">${getStepDate(4)}</div></div>
                </div>
                <div class="comments-section">
                    <h3 style="color:#e9d5ff;">💬 Comentários</h3>
                    ${renderComments(data.comments)}
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

module.exports = app;
