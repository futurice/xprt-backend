import dotenv from 'dotenv';
import crypto from 'crypto';

const env = process.env;

if (!env.NODE_ENV || env.NODE_ENV === 'development') {
  dotenv.config({ silent: true });
}

const requiredEnvironmentVariables = [
  'DATABASE_URL',
  'SECRET',
  'OAUTH2_CLIENT_ID',
  'OAUTH2_CLIENT_SECRET',
  'OAUTH2_HOST',
  'OAUTH2_TOKEN_HOST',
  'OAUTH2_USER_ENDPOINT',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_TLS',
  'BACKEND_URL',
  'FRONTEND_URL',
  'ADMIN_EMAIL_TO',
];

if (env.NODE_ENV && (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test')) {
  requiredEnvironmentVariables.forEach((key) => {
    if (!env[key]) {
      /* eslint-disable no-console */
      console.log(`Warning: Environment variable ${key} not set.`);
      /* eslint-enable no-console */

      throw new Error('Quitting.');
    }
  });
}

const generateSecret = (bytes, type) => {
  console.log(`Generating ${type} secret with ${bytes} bytes...`);
  return crypto.randomBytes(bytes).toString('base64');
};

module.exports = Object.freeze({
  server: {
    host: env.HOST || '0.0.0.0',
    port: env.PORT || 3888,
  },
  frontendUrl: env.FRONTEND_URL || 'http://localhost:8080',
  backendUrl: env.BACKEND_URL || 'http://localhost:3888',
  adminEmail: env.ADMIN_EMAIL_TO || 'admin@hundred.org',
  db: {
    debug: false, // Toggle db debugging
    client: 'pg',
    connection: env.DATABASE_URL || {
      host: '127.0.0.1',
      user: 'postgres',
      password: '',
      database: 'xprt',
      ssl: false,
    },
  },
  auth: {
    secret: env.SECRET || generateSecret(256, 'jwt'),
    saltRounds: 10,
    options: {
      algorithms: ['HS256'],
      expiresIn: '24h',
    },
  },
  smtp: {
    host: env.SMTP_HOST,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    tls: env.SMTP_TLS === 'true',
  },
  oauth2: {
    userEndpoint: env.OAUTH2_USER_ENDPOINT,
    strategyOptions: {
      provider: {
        protocol: 'oauth2',
        auth: env.OAUTH2_HOST,
        token: env.OAUTH2_TOKEN_HOST,
      },
      password: env.SECRET || generateSecret(256, 'oauth2'),
      clientId: env.OAUTH2_CLIENT_ID,
      clientSecret: env.OAUTH2_CLIENT_SECRET,
      forceHttps: true,

      // Terrible idea but required if not using HTTPS especially if developing locally
      // isSecure: false,
    },
  },
});
