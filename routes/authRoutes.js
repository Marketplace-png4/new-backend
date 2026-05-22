import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

if (!jwtSecret || !jwtRefreshSecret) {
  console.warn('JWT_SECRET and JWT_REFRESH_SECRET should be set in .env for production');
}

const createToken = (user, secret, expiresIn) =>
  jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn });

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType, phone, whatsapp, streetAddress, city, state, country } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      accountType,
      phone,
      whatsapp,
      streetAddress,
      city,
      state,
      country,
    });

    const token = createToken(user, jwtSecret || 'secret', '1h');
    const refreshToken = createToken(user, jwtRefreshSecret || 'refresh_secret', '7d');

    res.status(201).json({
      message: 'Signup successful',
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, accountType: user.accountType },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user, jwtSecret || 'secret', '1h');
    const refreshToken = createToken(user, jwtRefreshSecret || 'refresh_secret', '7d');
    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, accountType: user.accountType },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token missing' });
    }

    const decoded = jwt.verify(refreshToken, jwtRefreshSecret || 'refresh_secret');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const token = createToken(user, jwtSecret || 'secret', '1h');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Refresh token invalid or expired' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/forgot-password', async (req, res) => {
  res.json({ message: 'If this email is registered, password reset instructions have been sent.' });
});

router.post('/reset-password/:token', async (req, res) => {
  res.json({ message: 'Password reset endpoint is configured. Implement email reset logic in production.' });
});

router.get('/verify-email/:token', async (req, res) => {
  res.json({ message: 'Email verification endpoint is configured. Implement link verification in production.' });
});

export default router;
