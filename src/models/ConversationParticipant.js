import { DataTypes } from 'sequelize';
import sequelize from '../tools/database.js';

const ConversationParticipant = sequelize.define('ConversationParticipant', {
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
        allowNull: false
        // references will be set in associations
    },
    joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

export default ConversationParticipant;