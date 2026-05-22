import express from 'express';

export default function mountMockRoutes(app) {
  // Simple mock endpoints used when FAKE_DB_MODE is active
  app.get('/api', (req, res) => res.json({ message: 'Mock API root' }));
  app.get('/api/products', (req, res) => res.json([{ id: 'p1', title: 'Mock Product' }]));
  app.get('/api/categories', (req, res) => res.json([{ id: 'c1', name: 'Mock Category' }]));
  app.get('/api/wishlist', (req, res) => res.json([]));
  app.get('/api/cart', (req, res) => res.json({ items: [], total: 0 }));
  app.post('/api/auth/signup', (req, res) => res.status(201).json({ message: 'Mock signup' }));
  app.post('/api/auth/login', (req, res) => res.json({ token: 'mock-token' }));
  app.get('/api/health', (req, res) => res.json({ status: 'mock-healthy' }));
}
