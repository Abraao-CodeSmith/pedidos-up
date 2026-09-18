require('dotenv').config();
const path = require('path');

module.exports = {
    port: process.env.PORT || 3004,
    jwtSecret: process.env.JWT_SECRET || 'cardtrello_default_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    databasePath: path.resolve(process.cwd(), process.env.DATABASE_PATH || './database.sqlite'),
    trello: {
        baseUrl: 'https://api.trello.com/1',
        defaultApiKey: process.env.API_KEY || '',
        defaultToken: process.env.TOKEN || '',
        defaultBoardId: process.env.BOARD_ID || ''
    }
};
