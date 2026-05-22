import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ id: 'm1', from: 'alice', text: 'Hello' }]);
});

router.post('/', (req, res) => {
  const message = { id: Date.now().toString(), ...req.body };
  res.status(201).json({ message: 'Message created (mock)', message });
});

export default router;
