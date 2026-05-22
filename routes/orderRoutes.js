import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json([]);
});

router.post('/', (req, res) => {
  const order = { id: Date.now().toString(), ...req.body };
  res.status(201).json({ message: 'Order created (mock)', order });
});

export default router;
