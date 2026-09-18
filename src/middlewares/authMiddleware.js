const authService = require('../services/authService');
const userService = require('../services/userService');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.query && req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({
                error: 'Acesso negado. Token de autenticação não fornecido no cabeçalho Authorization.'
            });
        }

        let decoded;
        try {
            decoded = authService.verifyToken(token);
        } catch (err) {
            return res.status(401).json({
                error: 'Token inválido ou expirado. Faça login novamente.'
            });
        }

        const user = await userService.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                error: 'Usuário não encontrado.'
            });
        }

        // Anexa dados do usuário (incluindo credenciais do Trello) no req.user
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authMiddleware;
