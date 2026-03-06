const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    passwordHash: { type: String, required: true },
    countdownDate: { type: Date },
    heroMessage: {
        type: String,
        default: 'Every moment with you is a story worth telling...',
    },
    heroName: { type: String, default: 'My Love' },
});

module.exports = mongoose.model('Settings', settingsSchema);