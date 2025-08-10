import sequelize, { testConnection } from './database.js';

import * as models from '../models/index.js';

/**
 * Database synchronization functions
 */

export const syncDatabase = async (options = {}) => {
    const { force = false, alter = false } = options;
    
    try {
        console.log('Connecting to database...');
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error('Database connection failed');
        }
        
        console.log('Synchronizing database...');
        await sequelize.sync({ force, alter });
        console.log('Database synchronized successfully');
        
    } catch (error) {
        console.error('Database sync error:', error.message);
        throw error;
    }
};

export const checkDatabaseStatus = async () => {
    console.log('Checking database...');
    return await testConnection();
};

export const closeDatabaseConnection = async () => {
    await sequelize.close();
    console.log('Database connection closed');
};

export const initializeDatabase = async () => {
    try {
        await syncDatabase({ force: true });
        console.log('Database initialized');
    } catch (error) {
        console.error('Database initialization error:', error.message);
        throw error;
    }
};
