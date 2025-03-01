const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    warnings: [{
        reason: { type: String, default: 'No reason provided' },
        moderator: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Warns', warningSchema); 