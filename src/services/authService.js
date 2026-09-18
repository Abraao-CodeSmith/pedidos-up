const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userService = require('./userService');

class AuthService {
    /**
     * Gera o hash da senha usando bcrypt.
     */
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    /**
     * Compara a senha informada com o hash salvo.
     */
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    /**
     * Gera o token JWT para o usuário.
     */
    generateToken(payload) {
        return jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn
        });
    }

    /**
     * Verifica e decodifica o token JWT.
     */
    verifyToken(token) {
        return jwt.verify(token, config.jwtSecret);
    }

    /**
     * Registra um novo usuário no sistema.
     */
    async register({ name, email, password, trelloApiKey, trelloToken, trelloBoardId }) {
        if (!name || !email || !password) {
            const error = new Error('Nome, e-mail e senha são obrigatórios.');
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            const error = new Error('Este e-mail já está em uso.');
            error.statusCode = 409;
            throw error;
        }

        const passwordHash = await this.hashPassword(password);

        const newUser = await userService.createUser({
            name,
            email,
            passwordHash,
            trelloApiKey,
            trelloToken,
            trelloBoardId
        });

        const token = this.generateToken({ userId: newUser.id, email: newUser.email });

        return {
            user: userService.sanitizeUser(newUser),
            token
        };
    }

    /**
     * Autentica um usuário existente.
     */
    async login({ email, password }) {
        if (!email || !password) {
            const error = new Error('E-mail e senha são obrigatórios.');
            error.statusCode = 400;
            throw error;
        }

        const user = await userService.findByEmail(email);
        if (!user) {
            const error = new Error('E-mail ou senha inválidos.');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await this.comparePassword(password, user.password_hash);
        if (!isMatch) {
            const error = new Error('E-mail ou senha inválidos.');
            error.statusCode = 401;
            throw error;
        }

        const token = this.generateToken({ userId: user.id, email: user.email });

        return {
            user: userService.sanitizeUser(user),
            token
        };
    }
}

module.exports = new AuthService();
