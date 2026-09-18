const authService = require('../services/authService');
const userService = require('../services/userService');

class AuthController {
    /**
     * Cadastro de novo usuário.
     * POST /api/auth/register
     */
    async register(req, res, next) {
        try {
            const { name, email, password, trelloApiKey, trelloToken, trelloBoardId } = req.body;

            const result = await authService.register({
                name,
                email,
                password,
                trelloApiKey,
                trelloToken,
                trelloBoardId
            });

            return res.status(201).json({
                message: 'Usuário cadastrado com sucesso!',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Autenticação de usuário.
     * POST /api/auth/login
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await authService.login({ email, password });

            return res.status(200).json({
                message: 'Login realizado com sucesso!',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retorna os dados do usuário logado.
     * GET /api/auth/me
     */
    async getProfile(req, res, next) {
        try {
            const user = userService.sanitizeUser(req.user);
            return res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
