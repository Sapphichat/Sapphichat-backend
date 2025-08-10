import { DataTypes } from 'sequelize';
import sequelize from '../tools/database.js';

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    expiresAt: {
        type: DataTypes.DATE(3),
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
        // references will be set in associations
    }
}, {
    timestamps: true,
    updatedAt: false,
    createdAt: true
});

export default Session;