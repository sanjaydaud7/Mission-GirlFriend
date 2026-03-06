const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /api/auth/unlock — compare against SITE_PASSWORD in .env
router.post('/unlock', (req, res) => {
    const { password } = req.body;
    if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: 'Password is required' });
    }

    const sitePassword = process.env.SITE_PASSWORD;
    if (!sitePassword) {
        return res.status(500).json({ message: 'SITE_PASSWORD is not set in .env' });
    }

    if (password !== sitePassword) {
        return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ unlocked: true }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.json({ token });
});

module.exports = router;