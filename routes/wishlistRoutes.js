import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json([]);
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Added to wishlist (mock)', item: req.body });
});

router.delete('/', (req, res) => {
  res.json({ message: 'Removed from wishlist (mock)' });
});

export default router;
