import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure server data directory exists for secure server-side storage
const SERVER_DATA_DIR = path.join(__dirname, 'server-data');
if (!fs.existsSync(SERVER_DATA_DIR)) {
  fs.mkdirSync(SERVER_DATA_DIR, { recursive: true });
}

const AUTH_FILE = path.join(SERVER_DATA_DIR, 'auth.json');

// Helper to hash password using PBKDF2 with salt
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

// Initialize secure auth store if not present
function getOrCreateAuthRecord(): { salt: string; hash: string } {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      if (data.salt && data.hash) {
        return data;
      }
    } catch (err) {
      console.error('Error reading auth file, reinitializing', err);
    }
  }

  // Initial secure default (never stored in plain text anywhere in source)
  const salt = crypto.randomBytes(16).toString('hex');
  const defaultInitialPass = 'hasnain786';
  const hash = hashPassword(defaultInitialPass, salt);
  const record = { salt, hash };
  fs.writeFileSync(AUTH_FILE, JSON.stringify(record, null, 2), 'utf-8');
  return record;
}

// Active session tokens map: token -> expiry timestamp
const activeSessions = new Map<string, number>();

// --- API Endpoints ---

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const { salt, hash } = getOrCreateAuthRecord();
    const computed = hashPassword(password, salt);

    if (crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash))) {
      // Create session token valid for 24 hours
      const token = crypto.randomBytes(32).toString('hex');
      activeSessions.set(token, Date.now() + 24 * 60 * 60 * 1000);
      return res.json({ success: true, token, message: 'Authentication successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid Admin Password' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication' });
  }
});

// 2. Verify Session
app.post('/api/admin/verify', (req, res) => {
  const token = req.headers['x-admin-token'] as string;
  if (!token) {
    return res.status(401).json({ valid: false });
  }

  const expiry = activeSessions.get(token);
  if (expiry && expiry > Date.now()) {
    return res.json({ valid: true });
  } else {
    if (expiry) activeSessions.delete(token);
    return res.status(401).json({ valid: false });
  }
});

// 3. Change Password (can be changed unlimited times)
app.post('/api/admin/change-password', (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'New password must be at least 4 characters' });
    }

    const { salt, hash } = getOrCreateAuthRecord();
    const currentComputed = hashPassword(currentPassword, salt);

    if (!crypto.timingSafeEqual(Buffer.from(currentComputed), Buffer.from(hash))) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    // Generate new random salt and hash
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(newPassword, newSalt);

    fs.writeFileSync(AUTH_FILE, JSON.stringify({ salt: newSalt, hash: newHash }, null, 2), 'utf-8');

    // Invalidate old sessions and issue fresh token
    activeSessions.clear();
    const freshToken = crypto.randomBytes(32).toString('hex');
    activeSessions.set(freshToken, Date.now() + 24 * 60 * 60 * 1000);

    return res.json({
      success: true,
      message: 'Admin Password successfully changed!',
      token: freshToken,
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

// 4. Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const token = req.headers['x-admin-token'] as string;
  if (token) {
    activeSessions.delete(token);
  }
  return res.json({ success: true });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Hasnain Gadget Store server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
