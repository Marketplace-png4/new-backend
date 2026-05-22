import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDatabase, closeDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { applySecurityMiddleware } from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const useInMemoryDb = process.env.USE_IN_MEMORY_DB === 'true';
if (useInMemoryDb) {
  console.log('ℹ️ USE_IN_MEMORY_DB=true; clearing MONGODB_URI from dotenv so in-memory MongoDB is used');
  delete process.env.MONGODB_URI;
}

const app = express();
const PORT = process.env.PORT || 10000;
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.FRONTEND_URL_PRODUCTION || 'https://joshua-marketplace.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.set('trust proxy', 1);
applySecurityMiddleware(app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Origin not allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn('⚠️ JWT secrets are missing. Set JWT_SECRET and JWT_REFRESH_SECRET in .env');
}

const isFakeDbMode = process.env.FAKE_DB_MODE === 'true';

if (!process.env.MONGODB_URI && !isFakeDbMode && !useInMemoryDb) {
  console.error('✗ MONGODB_URI is missing. Set it in .env or .env.example');
  process.exit(1);
}

async function startServer() {
  try {
    if (!isFakeDbMode) {
      if (useInMemoryDb) {
        try {
          await connectDatabase();
          console.log('✓ In-memory MongoDB connected successfully');
        } catch (error) {
          console.warn('⚠️ In-memory MongoDB failed to start. Falling back to mock API mode.');
          console.warn(error.message || error);
          const { default: mountMockRoutes } = await import('./mocks/mockServer.js');
          mountMockRoutes(app);
        }
      } else {
        await connectDatabase();
        console.log('✓ Database connected successfully');
      }
    } else {
      // mount lightweight mock server for frontend testing without Mongo
      const { default: mountMockRoutes } = await import('./mocks/mockServer.js');
      mountMockRoutes(app);
    }

    app.get('/api', (req, res) => {
      res.json({
        message: 'Joshua Marketplace API is running',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          products: '/api/products',
          categories: '/api/categories',
          wishlist: '/api/wishlist',
          cart: '/api/cart',
          orders: '/api/orders',
          health: '/api/health',
        },
      });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/messages', messageRoutes);

    app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date() });
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('Available routes:');
      console.log('  GET    /api/health');
      console.log('  POST   /api/auth/signup');
      console.log('  POST   /api/auth/login');
      console.log('  POST   /api/auth/logout');
      console.log('  POST   /api/auth/refresh-token');
      console.log('  GET    /api/auth/me');
      console.log('  PUT    /api/auth/me');
      console.log('  POST   /api/auth/forgot-password');
      console.log('  POST   /api/auth/reset-password/:token');
      console.log('  GET    /api/auth/verify-email/:token');
      console.log('  GET    /api/products');
      console.log('  POST   /api/products');
      console.log('  GET    /api/products/:id');
      console.log('  PUT    /api/products/:id');
      console.log('  DELETE /api/products/:id');
      console.log('  GET    /api/categories');
      console.log('  POST   /api/categories');
      console.log('  GET    /api/wishlist');
      console.log('  POST   /api/wishlist');
      console.log('  DELETE /api/wishlist');
      console.log('  GET    /api/cart');
      console.log('  POST   /api/cart');
      console.log('  PUT    /api/cart');
      console.log('  DELETE /api/cart');
      console.log('  GET    /api/orders');
      console.log('  POST   /api/orders');
    });
    const shutdown = async () => {
      console.log('\nℹ️ Graceful shutdown initiated');
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('unhandledRejection', async (reason) => {
      console.error('✗ Unhandled Rejection:', reason);
      await shutdown();
    });
    process.on('uncaughtException', async (error) => {
      console.error('✗ Uncaught Exception:', error);
      await shutdown();
    });  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
