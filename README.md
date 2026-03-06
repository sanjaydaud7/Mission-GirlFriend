# Mission Girlfriend ❤

A romantic, dark-themed, password-gated MERN memory website. One scrollable home page with animated sections: glowing timeline, memory wall, handwritten love letter, and live countdown.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express |
| Auth | bcryptjs + JWT |
| File uploads | Multer → local `server/uploads/` |
| Frontend | React (CRA) |
| Animations | Framer Motion + GSAP ScrollTrigger |
| Styling | Tailwind CSS (dark red/black/gold theme) |

---

## Project Structure

```
MG 2/
├── server/
│   ├── middleware/authMiddleware.js
│   ├── models/         (Settings, StoryEvent, Memory)
│   ├── routes/         (auth, memories, story, settings)
│   ├── uploads/        ← Multer saves uploaded photos here
│   ├── .env            ← MongoDB URI, JWT secret, seed password
│   ├── server.js
│   └── seed.js
└── client/
    ├── public/
    │   └── images/     ← Place your personal photos here
    └── src/
        ├── components/ (PasswordGate, Navbar, Hero, OurStory,
        │                MemoryWall, Lightbox, LoveLetter, Countdown)
        ├── pages/Home.jsx
        └── utils/api.js
```

---

## Quick Start

### 1 — Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (`mongod`) **or** a MongoDB Atlas connection string

### 2 — Server setup

```bash
cd server
npm install
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/mission-girlfriend
JWT_SECRET=replace-with-a-long-random-string
PORT=5000
CLIENT_URL=http://localhost:3000
SEED_PASSWORD=iloveyou       # ← change to your chosen password
```

Seed the database:
```bash
npm run seed
```

This creates:
- Site settings (hashed password, 30-day countdown, hero name/message)
- 4 story timeline events
- 5 sample memories (pointing to `client/public/images/`)

### 3 — Client setup

```bash
cd client
npm install
```

### 4 — Run both servers

**Terminal 1 — backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — frontend:**
```bash
cd client && npm start
```

Open **http://localhost:3000** and enter your unlock password.

---

## Adding Your Photos

### Option A — public images folder (simplest)
Place your images in `client/public/images/`:
```
client/public/images/
  memory1.jpg   ← matches seed data
  memory2.jpg
  story1.jpg
  story2.jpg
  ...
```
The seed script already references these paths (`/images/memory1.jpg`), so they load instantly without any upload step.

### Option B — upload via API (Postman / fetch)
```
POST http://localhost:5000/api/memories
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data

Fields:
  title       (string, required)
  caption     (string)
  mediaType   photo | video
  takenAt     ISO date string
  tags        JSON array string, e.g. ["dates","favorites"]
  media       (file)
```

Uploaded files are saved to `server/uploads/` and served at `http://localhost:5000/uploads/<filename>`.

---

## Customisation

### Change unlock password
Edit `SEED_PASSWORD` in `server/.env`, then re-run:
```bash
cd server && npm run seed
```
> **Warning:** re-seeding clears and repopulates the entire database.

### Change the countdown date
```
PUT http://localhost:5000/api/settings
Authorization: Bearer <token>
Content-Type: application/json

{ "countdownDate": "2026-06-14T18:00:00.000Z" }
```

Or directly in MongoDB Compass / Atlas: update the `Settings` document's `countdownDate` field.

### Change hero name & message
Same PUT request to `/api/settings`:
```json
{
  "heroName": "Her Name",
  "heroMessage": "A message written just for her..."
}
```

### Edit the love letter
Open `client/src/components/LoveLetter.jsx` and edit the `LETTER_LINES` array at the top of the file.

### Edit story events
Open `server/seed.js` and update the `storyEvents` array, then re-run `npm run seed`.

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/unlock` | — | Verify password → JWT |
| GET | `/api/story` | — | List story events |
| POST | `/api/story` | ✓ | Add story event |
| PUT | `/api/story/:id` | ✓ | Update story event |
| DELETE | `/api/story/:id` | ✓ | Delete story event |
| GET | `/api/memories` | ✓ | List memories |
| POST | `/api/memories` | ✓ | Upload memory |
| DELETE | `/api/memories/:id` | ✓ | Delete memory |
| GET | `/api/settings` | ✓ | Get settings |
| PUT | `/api/settings` | ✓ | Update settings |

---

## Colour Palette

| Name | Hex | Usage |
|------|-----|-------|
| Blood red | `#8B0000` | Primary accent, glows |
| Gold | `#FFD700` | Headers, captions |
| Dark gold | `#B8860B` | Borders, corners |
| Night | `#0a0a0a` | Page background |
| Ember | `#141414` | Card backgrounds |
