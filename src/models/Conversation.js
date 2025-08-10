import { DataTypes } from 'sequelize';
import sequelize from '../tools/database.js';

const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isGroup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    creatorId: {
        type: DataTypes.STRING,
        allowNull: false
        // references will be set in associations
    }
}, {
    timestamps: true
});

export default Conversation;