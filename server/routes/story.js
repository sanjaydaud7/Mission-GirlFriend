const express = require('express');
const StoryEvent = require('../models/StoryEvent');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/story — public (no auth needed to display the story)
router.get('/', async(req, res) => {
    try {
        const events = await StoryEvent.find().sort({ order: 1 });
        res.json(events);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/story
router.post('/', auth, async(req, res) => {
    try {
        const event = new StoryEvent(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/story/:id
router.put('/:id', auth, async(req, res) => {
    try {
        const event = await StoryEvent.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/story/:id
router.delete('/:id', auth, async(req, res) => {
    try {
        await StoryEvent.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;