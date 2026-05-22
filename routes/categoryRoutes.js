import express from 'express';
import Category from '../models/Category.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    const category = await Category.create({ name });
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

export default router;
