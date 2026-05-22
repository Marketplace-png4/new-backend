import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!Array.isArray(items) || typeof total !== 'number') {
      return res.status(400).json({ error: 'Order requires items array and total number' });
    }
    const order = await Order.create({ user: req.user._id, items, total, status: 'pending' });
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
