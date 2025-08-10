import { DataTypes } from 'sequelize';
import sequelize from '../tools/database.js';

const Settings = sequelize.define('Settings', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
        allowNull: false,
        defaultValue: 'string',
    },
}, {
    tableName: 'Settings',
    timestamps: false,
});

export default Settings;
