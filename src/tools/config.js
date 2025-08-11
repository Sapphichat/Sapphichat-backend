import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

// Session configuration
const session_duration = process.env.SESSION_DURATION || 86400; // 24 hours in seconds by default

// Database configuration with support for MariaDB, PostgreSQL, and SQLite
const database = {
    dialect: process.env.DB_DIALECT || 'mariadb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || (process.env.DB_DIALECT === 'postgres' ? 5432 : 3306),
    database: process.env.DB_NAME || 'sapphichat-backend',
    username: process.env.DB_USER || 'sapphichat',
    password: process.env.DB_PASSWORD || 'sapphichat',
    storage: process.env.DB_STORAGE || './database.sqlite' // For SQLite only
};

export default { port, database, session_duration };