const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const FILE = path.join(__dirname, '..', 'data', 'settings.json');

const DEFAULT_SETTINGS = {
    heroName: 'My Love',
    heroMessage: 'Every moment with you is a memory I will cherish forever.',
    countdownDate: '2026-12-31T00:00:00.000Z',
};

function readSettings() {
    try {
        if (!fs.existsSync(FILE)) return {...DEFAULT_SETTINGS };
        return JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch {
        return {...DEFAULT_SETTINGS };
    }
}

function writeSettings(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/settings
router.get('/', auth, (req, res) => {
    res.json(readSettings());
});

// PUT /api/settings
router.put('/', auth, (req, res) => {
    const { countdownDate, heroMessage, heroName } = req.body;
    const current = readSettings();
    const updated = {
        ...current,
        ...(heroName !== undefined && { heroName }),
        ...(heroMessage !== undefined && { heroMessage }),
        ...(countdownDate !== undefined && { countdownDate }),
    };
    writeSettings(updated);
    res.json(updated);
});

module.exports = router;