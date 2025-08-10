import User from './User.js';
import Message from './Message.js';
import Conversation from './Conversation.js';
import ConversationParticipant from './ConversationParticipant.js';
import Role from './Role.js';
import Session from './Session.js';
import Settings from './Settings.js';
import Media from './Media.js';

// Associations User <-> Message
Message.belongsTo(User, {
    foreignKey: 'senderId',
    onDelete: 'CASCADE'
});
User.hasMany(Message, {
    foreignKey: 'senderId',
    onDelete: 'CASCADE'
});

// Associations Conversation <-> Message
Message.belongsTo(Conversation, {
    foreignKey: 'conversationId',
    onDelete: 'CASCADE'
});
Conversation.hasMany(Message, {
    foreignKey: 'conversationId',
    onDelete: 'CASCADE'
});

// Associations Conversation <-> ConversationParticipant
Conversation.hasMany(ConversationParticipant, {
    foreignKey: 'conversationId',
    onDelete: 'CASCADE'
});
ConversationParticipant.belongsTo(Conversation, {
    foreignKey: 'conversationId',
    onDelete: 'CASCADE'
});

// Associations User <-> ConversationParticipant
ConversationParticipant.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
User.hasMany(ConversationParticipant, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

// Associations User <-> Role
User.belongsTo(Role, {
    foreignKey: 'roleId'
});
Role.hasMany(User, {
    foreignKey: 'roleId'
});

// Associations User <-> Session
Session.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
User.hasMany(Session, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

// Associations User <-> Conversation (owner)
Conversation.belongsTo(User, {
    foreignKey: 'creatorId',
    as: 'owner',
    onDelete: 'CASCADE'
});
User.hasMany(Conversation, {
    foreignKey: 'creatorId',
    as: 'ownedConversations',
    onDelete: 'CASCADE'
});

// Export all models
export {
    User,
    Message,
    Conversation,
    ConversationParticipant,
    Role,
    Session,
    Settings,
    Media
};