import express from 'express';
import Message from '../models/Message.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { from, email, text } = req.body;
    const message = await Message.create({ from, email, text });
    res.status(201).json({ message: 'Message saved', message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;
