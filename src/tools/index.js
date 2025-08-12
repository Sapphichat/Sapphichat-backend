// Export all tools from a single file to facilitate imports

// Configuration modules
import config from './config.js';
import configDb, { loadSettings as loadDynamicSettings, setSetting, getSetting, deleteSetting, reload as reloadDynamicSettings } from './configDb.js';

// Database utilities
import sequelize, { testConnection } from './database.js';
import { 
    syncDatabase, 
    checkDatabaseStatus, 
    closeDatabaseConnection, 
    initializeDatabase,
    insertDefaultRoles,
    loadAndSeedDynamicSettings
} from './syncdb.js';

// ID generation utilities
import { 
    generateUniqueId, 
    generateShortId, 
    generateNumericId,
    verifyTransPrideIntegration,
    getTransPrideInfo
} from './generateId.js';

// Validation utilities
import { validateUserPassword } from './validatePassword.js';

// API response utilities
import { successResponse, errorResponse } from './apiResponse.js';

export {
    // Configuration
    config,
    configDb,
    loadDynamicSettings,
    setSetting,
    getSetting,
    deleteSetting,
    reloadDynamicSettings,
    
    // Database
    sequelize,
    testConnection,
    syncDatabase,
    checkDatabaseStatus,
    closeDatabaseConnection,
    initializeDatabase,
    insertDefaultRoles,
    loadAndSeedDynamicSettings,
    
    // ID Generation
    generateUniqueId,
    generateShortId,
    generateNumericId,
    verifyTransPrideIntegration,
    getTransPrideInfo,
    
    // Validation
    validateUserPassword,
    
    // API Response
    successResponse,
    errorResponse
};
