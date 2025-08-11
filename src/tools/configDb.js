// Dynamic database-backed configuration access (configDb.*)
// Provides cached access to Settings table values with on-demand reload and helpers.
import { Settings } from '../models/index.js';

// Internal cache map(id -> parsedValue)
let settingsCache = new Map();
let isLoaded = false;

// Parse a DB row to the proper JS value according to type column
function parseValue(raw, type) {
    switch (type) {
        case 'number':
            return Number(raw);
        case 'boolean':
            return raw === 'true' || raw === true;
        case 'json':
            try { return JSON.parse(raw); } catch { return null; }
        case 'string':
        default:
            return raw;
    }
}

// Infer type from JS value when inserting/updating if not provided
function inferType(value) {
    if (value === null || value === undefined) return 'string';
    if (Array.isArray(value) || typeof value === 'object') return 'json';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    return 'string';
}

// Serialize JS value to string for storage (except plain string)
function serialize(value, type) {
    if (type === 'json') return JSON.stringify(value);
    if (type === 'boolean') return value ? 'true' : 'false';
    return String(value);
}

export async function loadSettings() {
    const rows = await Settings.findAll();
    const map = new Map();
    for (const row of rows) {
        map.set(row.id, parseValue(row.value, row.type));
    }
    settingsCache = map;
    isLoaded = true;
    return settingsCache;
}

export function getSetting(key, defaultValue = undefined) {
    if (!isLoaded) return defaultValue; // not yet loaded in memory
    return settingsCache.has(key) ? settingsCache.get(key) : defaultValue;
}

export async function setSetting(key, value, type) {
    const finalType = type || inferType(value);
    const serialized = serialize(value, finalType);
    await Settings.upsert({ id: key, value: serialized, type: finalType });
    // Update cache immediately
    settingsCache.set(key, parseValue(serialized, finalType));
}

export async function deleteSetting(key) {
    await Settings.destroy({ where: { id: key } });
    settingsCache.delete(key);
}

export async function reload() {
    return loadSettings();
}

// Provide a Proxy so code can access configDb.MAINTENANCE_MODE similar to config.port
const base = {
    get: getSetting,
    set: setSetting,
    delete: deleteSetting,
    reload,
    load: loadSettings,
    has: (key) => settingsCache.has(key),
    keys: () => Array.from(settingsCache.keys()),
    entries: () => Array.from(settingsCache.entries())
};

const configDb = new Proxy(base, {
    get(target, prop) {
        if (Reflect.has(target, prop)) return Reflect.get(target, prop);
        const key = String(prop);
        return getSetting(key);
    },
    has(_, prop) {
        return settingsCache.has(String(prop));
    },
    ownKeys() {
        return [...settingsCache.keys()];
    },
    getOwnPropertyDescriptor() {
        return { enumerable: true, configurable: true };
    }
});

export default configDb;
