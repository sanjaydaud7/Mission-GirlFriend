require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Settings = require('./models/Settings');
const StoryEvent = require('./models/StoryEvent');
const Memory = require('./models/Memory');

const SEED_PASSWORD = process.env.SEED_PASSWORD || 'iloveyou';

const storyEvents = [
  {
    order: 1,
    date: 'The Beginning',
    title: 'The Day We Met',
    description:
      "Some stories start with a crash, others with a smile. Ours started with a moment I knew I'd never forget. You walked in and the whole room shifted.",
    imageUrl: '/images/story1.jpg',
  },
  {
    order: 2,
    date: 'A Month Later',
    title: 'Our First Date',
    description:
      'Nervous hands, warm laughter, and the slow realization that I could spend forever just listening to you talk about everything and nothing at all.',
    imageUrl: '/images/story2.jpg',
  },
  {
    order: 3,
    date: 'Growing Together',
    title: 'Adventures Begin',
    description:
      'Road trips with no plan, late nights with no end, and inside jokes no one else would ever understand. Just us, against the whole wide world.',
    imageUrl: '/images/story3.jpg',
  },
  {
    order: 4,
    date: 'Every Single Day',
    title: 'The Ordinary Magic',
    description:
      'The ordinary moments became the most extraordinary ones. Coffee in the morning, your laugh in the afternoon, and you beside me at night. Perfect.',
    imageUrl: '/images/story4.jpg',
  },
];

const memories = [
  {
    title: 'That First Smile',
    caption: 'The one that started everything',
    mediaUrl: '/images/memory1.jpg',
    mediaType: 'photo',
    takenAt: new Date('2024-01-15'),
    tags: ['favorites'],
  },
  {
    title: 'Our Little Adventure',
    caption: 'Just you and me and the open road',
    mediaUrl: '/images/memory2.jpg',
    mediaType: 'photo',
    takenAt: new Date('2024-03-22'),
    tags: ['trips', 'favorites'],
  },
  {
    title: 'Silly Us',
    caption: 'When you make me laugh like no one else can',
    mediaUrl: '/images/memory3.jpg',
    mediaType: 'photo',
    takenAt: new Date('2024-05-10'),
    tags: ['silly'],
  },
  {
    title: 'Golden Hour',
    caption: 'Every sunset is better with you',
    mediaUrl: '/images/memory4.jpg',
    mediaType: 'photo',
    takenAt: new Date('2024-07-04'),
    tags: ['dates', 'favorites'],
  },
  {
    title: 'Coffee & You',
    caption: 'My favourite kind of morning',
    mediaUrl: '/images/memory5.jpg',
    mediaType: 'photo',
    takenAt: new Date('2024-09-18'),
    tags: ['dates'],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Settings.deleteMany({}),
    StoryEvent.deleteMany({}),
    Memory.deleteMany({}),
  ]);

  // Hash password with bcrypt (cost factor 12)
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);

  // Create settings — countdown 30 days from now
  await Settings.create({
    passwordHash,
    countdownDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    heroMessage: 'Every moment with you is a story worth telling...',
    heroName: 'My Love',
  });
  console.log(`✓ Settings created  |  Unlock password: "${SEED_PASSWORD}"`);

  await StoryEvent.insertMany(storyEvents);
  console.log(`✓ ${storyEvents.length} story events created`);

  await Memory.insertMany(memories);
  console.log(`✓ ${memories.length} memories created`);

  console.log('\n🔴 Database seeded successfully!');
  console.log(`   Unlock password → "${SEED_PASSWORD}"`);
  console.log('   Place your images in client/public/images/ (memory1.jpg … story1.jpg …)');
  console.log('   Update SEED_PASSWORD in server/.env then re-run to change the password.\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
