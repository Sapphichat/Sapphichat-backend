import { DataTypes } from 'sequelize';
import sequelize from '../tools/database.js';
// import Role from './Role.js'; // Uncomment when Role model is ready

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    displayname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(190),
        allowNull: true
    },
    twoFaSecret: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isTwoFaEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    banReason: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    roleId: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

export default User;