import { DataTypes } from 'sequelize';
import sequelize from '../tools/database.js';

// Rôle avec clé primaire string (nom en MAJUSCULE)
const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false,
});

export default Role;