const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// ── Storage paths ────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const DATA_FILE = path.join(__dirname, '..', 'data', 'memories.json');

function readMemories() {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function writeMemories(list) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

// ── Multer ───────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    },
});

const ALLOWED_MIMES = new Set([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm',
]);

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIMES.has(file.mimetype)) return cb(null, true);
        cb(new Error(`File type "${file.mimetype}" is not allowed`), false);
    },
    limits: { fileSize: 50 * 1024 * 1024 },
});

// GET /api/memories
router.get('/', auth, (req, res) => {
    const memories = readMemories().sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(memories);
});

// POST /api/memories
router.post('/', auth, upload.single('media'), (req, res) => {
    const { title, caption, mediaType, takenAt, tags } = req.body;

    let mediaUrl;
    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.mediaUrl) {
        mediaUrl = req.body.mediaUrl;
    } else {
        return res.status(400).json({ message: 'No media file or mediaUrl provided' });
    }

    const memory = {
        _id: Date.now().toString(),
        title: title || '',
        caption: caption || '',
        mediaUrl,
        mediaType: mediaType || 'photo',
        takenAt: takenAt ? new Date(takenAt).toISOString() : null,
        tags: tags ? JSON.parse(tags) : [],
        createdAt: new Date().toISOString(),
    };

    const list = readMemories();
    list.push(memory);
    writeMemories(list);

    res.status(201).json(memory);
});

// DELETE /api/memories/:id
router.delete('/:id', auth, (req, res) => {
    const list = readMemories();
    const idx = list.findIndex((m) => m._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Memory not found' });

    const [memory] = list.splice(idx, 1);
    writeMemories(list);

    if (memory.mediaUrl && memory.mediaUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', memory.mediaUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: 'Memory deleted' });
});

module.exports = router;