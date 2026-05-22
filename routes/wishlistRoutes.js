import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json(wishlist?.products || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: productId } },
      { upsert: true, new: true }
    ).populate('products');
    res.status(201).json({ message: 'Added to wishlist', wishlist: wishlist.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productId } },
      { new: true }
    ).populate('products');
    res.json({ message: 'Removed from wishlist', wishlist: wishlist?.products || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

export default router;
