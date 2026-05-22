import express from 'express';

const router = express.Router();

router.post('/signup', (req, res) => {
  // Mock signup - return the received body as the created user (no persistence)
  const user = { id: Date.now().toString(), ...req.body };
  res.status(201).json({ message: 'Mock signup successful', user });
});

router.post('/login', (req, res) => {
  // Mock login - accept any credentials and return a fake token
  const token = 'fake-jwt-token';
  res.json({ message: 'Mock login successful', token });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Mock logout successful' });
});

router.post('/refresh-token', (req, res) => {
  res.json({ token: 'fake-refreshed-token' });
});

router.get('/me', (req, res) => {
  res.json({ id: 'mock-user', email: 'user@example.com', name: 'Mock User' });
});

router.put('/me', (req, res) => {
  res.json({ message: 'Mock profile updated', profile: req.body });
});

export default router;
