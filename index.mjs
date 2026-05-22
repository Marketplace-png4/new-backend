// Lightweight wrapper to run server in FAKE_DB_MODE by default for local development
process.env.FAKE_DB_MODE = process.env.FAKE_DB_MODE || 'true';
import './server.js';
