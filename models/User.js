import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    accountType: { type: String, enum: ['seller', 'buyer'], default: 'buyer' },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    verified: { type: Boolean, default: false },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
