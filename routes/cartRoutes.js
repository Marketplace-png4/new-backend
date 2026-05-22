import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ items: [], total: 0 });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Item added to cart (mock)', item: req.body });
});

router.put('/', (req, res) => {
  res.json({ message: 'Cart updated (mock)', cart: req.body });
});

router.delete('/', (req, res) => {
  res.json({ message: 'Cart cleared (mock)' });
});

export default router;
