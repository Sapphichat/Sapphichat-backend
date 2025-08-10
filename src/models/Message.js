import { DataTypes } from 'sequelize';
import sequelize from '../tools/database.js';

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    conversationId: {
        type: DataTypes.STRING,
        allowNull: false
        // references will be set in associations
    },
    senderId: {
        type: DataTypes.STRING,
        allowNull: false
        // references will be set in associations
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sentAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

export default Message;