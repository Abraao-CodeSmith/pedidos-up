const crypto = require('crypto');
const db = require('../config/database');

class UserService {
    /**
     * Cria um novo usuário na base de dados.
     */
    async createUser({ name, email, passwordHash, trelloApiKey, trelloToken, trelloBoardId }) {
        const id = crypto.randomUUID();
        const sql = `
            INSERT INTO users (id, name, email, password_hash, trello_api_key, trello_token, trello_board_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.run(sql, [
            id,
            name,
            email.toLowerCase().trim(),
            passwordHash,
            trelloApiKey || null,
            trelloToken || null,
            trelloBoardId || null
        ]);

        return this.findById(id);
    }

    /**
     * Busca usuário pelo e-mail.
     */
    async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        return db.get(sql, [email.toLowerCase().trim()]);
    }

    /**
     * Busca usuário pelo ID.
     */
    async findById(id) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        return db.get(sql, [id]);
    }

    /**
     * Remove a hash da senha antes de retornar os dados do usuário.
     */
    sanitizeUser(user) {
        if (!user) return null;
        const { password_hash, ...sanitized } = user;
        return sanitized;
    }
}

module.exports = new UserService();
