import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ id: 'p1', title: 'Sample Product', price: 9.99 }]);
});

router.post('/', (req, res) => {
  const product = { id: Date.now().toString(), ...req.body };
  res.status(201).json({ message: 'Product created (mock)', product });
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, title: 'Sample Product', price: 9.99 });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Product updated (mock)', id: req.params.id, updates: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Product deleted (mock)', id: req.params.id });
});

export default router;
