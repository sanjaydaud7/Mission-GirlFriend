const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    caption: { type: String, default: '' },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['photo', 'video'], default: 'photo' },
    takenAt: { type: Date },
    tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Memory', memorySchema);