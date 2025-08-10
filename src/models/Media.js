import { DataTypes } from 'sequelize';
import sequelize from '../tools/database.js';

const Media = sequelize.define('Media', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
        // references will be set in associations
    },
    conversationId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    updatedAt: false,
    createdAt: true
});

export default Media;