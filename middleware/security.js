import helmet from 'helmet';

export function applySecurityMiddleware(app) {
  try {
    app.use(helmet());
  } catch (e) {
    // helmet may not be available in some environments; fail gracefully
    console.warn('helmet not available, skipping');
  }
  app.disable('x-powered-by');
}
