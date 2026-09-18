const sqlite3 = require('sqlite3').verbose();
const config = require('./env');

const db = new sqlite3.Database(config.databasePath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log(`[SQLite] Conectado com sucesso em: ${config.databasePath}`);
    }
});

// Habilitar chaves estrangeiras
db.run('PRAGMA foreign_keys = ON;');

// Criar tabela de usuários na inicialização se não existir
const initDb = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            trello_api_key TEXT,
            trello_token TEXT,
            trello_board_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;

    db.exec(sql, (err) => {
        if (err) {
            console.error('Erro ao inicializar tabela de usuários no SQLite:', err.message);
        } else {
            console.log('[SQLite] Tabela "users" pronta para uso.');
        }
    });
};

initDb();

// Helpers com Promises para manipulação assíncrona
const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    db,
    run,
    get,
    all
};
