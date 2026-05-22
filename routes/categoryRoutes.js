import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ id: 'c1', name: 'General' }]);
});

router.post('/', (req, res) => {
  const cat = { id: Date.now().toString(), ...req.body };
  res.status(201).json({ message: 'Category created (mock)', cat });
});

export default router;
