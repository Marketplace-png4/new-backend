import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
