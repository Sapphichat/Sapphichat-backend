// Export all tools from a single file to facilitate imports
export { 
    generateUniqueId, 
    generateShortId, 
    generateNumericId,
    verifyTransPrideIntegration,
    getTransPrideInfo
} from './generateId.js';

export { default as config } from './config.js';
export { default as sequelize, testConnection } from './database.js';
export { 
    syncDatabase, 
    checkDatabaseStatus, 
    closeDatabaseConnection, 
    initializeDatabase 
} from './syncdb.js';

// Default export for additional compatibility
export default {
    generateUniqueId,
    generateShortId,
    generateNumericId,
    verifyTransPrideIntegration,
    getTransPrideInfo,
    config,
    sequelize,
    testConnection,
    syncDatabase,
    checkDatabaseStatus,
    closeDatabaseConnection,
    initializeDatabase
};
