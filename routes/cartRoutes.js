import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    const items = cart?.items || [];
    const total = items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);
    res.json({ items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity }] });
    } else {
      const existingItem = cart.items.find((item) => item.product.equals(productId));
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    cart = await cart.populate('items.product');
    res.status(201).json({ message: 'Added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Cart items must be an array' });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { upsert: true, new: true }
    ).populate('items.product');

    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
