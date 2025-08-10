import { Sequelize } from 'sequelize';
import config from './config.js';

// Database configuration with multi-dialect support
const sequelize = new Sequelize({
    dialect: config.database.dialect,
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    username: config.database.username,
    password: config.database.password,
    storage: config.database.storage, // For SQLite only
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: false,
        freezeTableName: true
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test database connection
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Database connection established successfully (${config.database.dialect})`);
        return true;
    } catch (error) {
        console.error('Unable to connect to database:', error.message);
        return false;
    }
};

export default sequelize;
