const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: [], 
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Message',
        default: [], 
    }],
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;