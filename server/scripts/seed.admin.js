require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// We need to load models directly to avoid circular deps
const User = require('../src/models/User.model');
const { ROLES } = require('../src/constants/roles');

const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env');
    process.exit(1);
  }

  const name = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error('❌ SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`⚠️  Admin with email "${email}" already exists. Skipping.`);
      process.exit(0);
    }

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: ROLES.SUPER_ADMIN,
      isActive: true,
      mustChangePassword: true,
    });

    console.log('✅ Super Admin created successfully!');
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Role  : ${admin.role}`);
    console.log(`   ID    : ${admin._id}`);
    console.log('');
    console.log('⚠️  Please change the password immediately after first login.');
  } catch (err) {
    console.error(`❌ Seed failed: ${err.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
