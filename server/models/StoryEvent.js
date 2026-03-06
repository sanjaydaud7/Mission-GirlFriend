const mongoose = require('mongoose');

const storyEventSchema = new mongoose.Schema({
    order: { type: Number, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('StoryEvent', storyEventSchema);