import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || process.env.DATABASE_URI;
  if (!uri) {
    throw new Error('MONGODB_URI or DATABASE_URL is required when not running in FAKE_DB_MODE');
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('MongoDB URI must start with mongodb:// or mongodb+srv://. Check MONGODB_URI / DATABASE_URL values.');
  }

  mongoose.set('strictQuery', false);

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('✓ MongoDB connected');
}

export async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  }
}
