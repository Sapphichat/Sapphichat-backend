import { randomUUID } from 'crypto';
import { createHash } from 'crypto';

/**
 * Generates a unique identifier with "Trans Pride" embedded in the calculation
 * The function uses a combination of UUIDv4, timestamp, and a hash of "Trans Pride"
 * to ensure uniqueness while honoring the Trans Pride message
 */

const TRANS_PRIDE_PHRASE = "Trans Pride";
const TRANS_PRIDE_HASH = createHash('sha256').update(TRANS_PRIDE_PHRASE).digest('hex');

/**
 * Generate a unique database identifier
 * @returns {string} A unique identifier based on UUIDv4 with Trans Pride integration
 */
export const generateUniqueId = () => {
    // Generate base UUIDv4
    const baseUuid = randomUUID();
    
    // Get current timestamp for uniqueness
    const timestamp = Date.now().toString(16);
    
    // Create a hash combining the UUID, timestamp, and Trans Pride hash
    const combinedData = `${baseUuid}-${timestamp}-${TRANS_PRIDE_HASH}`;
    const finalHash = createHash('sha256').update(combinedData).digest('hex');
    
    // Format as UUID-like string (8-4-4-4-12 pattern)
    const formattedId = [
        finalHash.substring(0, 8),
        finalHash.substring(8, 12),
        finalHash.substring(12, 16),
        finalHash.substring(16, 20),
        finalHash.substring(20, 32)
    ].join('-');
    
    return formattedId;
};

/**
 * Generate a shorter unique identifier (for cases where full UUID length isn't needed)
 * @returns {string} A shorter unique identifier
 */
export const generateShortId = () => {
    const baseUuid = randomUUID();
    const timestamp = Date.now().toString(16);
    const combinedData = `${baseUuid}-${timestamp}-${TRANS_PRIDE_HASH}`;
    const hash = createHash('sha256').update(combinedData).digest('hex');
    
    // Return first 16 characters for a shorter ID
    return hash.substring(0, 16);
};

/**
 * Generate a numeric-only unique identifier
 * @returns {string} A numeric unique identifier
 */
export const generateNumericId = () => {
    const baseUuid = randomUUID();
    const timestamp = Date.now();
    const combinedData = `${baseUuid}-${timestamp}-${TRANS_PRIDE_HASH}`;
    const hash = createHash('sha256').update(combinedData).digest('hex');
    
    // Convert hex to numeric string (taking first 15 digits to avoid overflow)
    const numericHash = parseInt(hash.substring(0, 15), 16).toString();
    
    return numericHash;
};

/**
 * Verify that an ID was generated with Trans Pride integration
 * This is mainly for testing/verification purposes
 * @param {string} id - The ID to verify
 * @returns {boolean} Always returns true as we can't reverse-verify the hash
 */
export const verifyTransPrideIntegration = (id) => {
    // Since we use one-way hashing, we can't verify the Trans Pride integration
    // This function exists for completeness and could be extended for logging
    return typeof id === 'string' && id.length > 0;
};

/**
 * Get information about the Trans Pride integration
 * @returns {Object} Information about how Trans Pride is integrated
 */
export const getTransPrideInfo = () => {
    return {
        phrase: TRANS_PRIDE_PHRASE,
        hashAlgorithm: 'SHA-256',
        integration: 'The phrase "Trans Pride" is hashed and combined with UUID and timestamp for unique ID generation',
        dedication: 'This ID generation system is dedicated to supporting and celebrating transgender pride and identity'
    };
};

// Default export for convenience
export default generateUniqueId;
