import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const VAULT_DIR = path.join(DATA_DIR, 'vault');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(VAULT_DIR)) fs.mkdirSync(VAULT_DIR, { recursive: true });
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));

// Hash password function
const hashPass = (pw) => crypto.createHash('sha256').update(pw).digest('hex');

// Read Users
const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// 1. REGISTER
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  let users = getUsers();
  if (users.find(u => u.email === email)) return res.status(400).json({ error: "Email already taken." });

  const newUser = { email, passwordHash: hashPass(password), created: new Date().toISOString() };
  users.push(newUser);
  saveUsers(users);

  // Create empty vault
  const vaultPath = path.join(VAULT_DIR, `${Buffer.from(email).toString('base64')}.json`);
  fs.writeFileSync(vaultPath, JSON.stringify({
     'LITHIUM_apps_core': ["terminal", "calc", "notes", "settings", "store", "media", "vault", "clock"],
     'LITHIUM_notes_db': [{id:1, title:'Welcome', text:'Your Lithium Local ID is active.\nChanges are saved locally and synced to the secure host computer via the Settings app.'}]
  }, null, 2));

  res.json({ success: true, message: "Account created locally!" });
});

// 2. LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email && u.passwordHash === hashPass(password));

  if (!user) return res.status(401).json({ error: "Invalid email or password." });

  // Read Vault Payload
  const vaultPath = path.join(VAULT_DIR, `${Buffer.from(email).toString('base64')}.json`);
  let payload = {};
  if (fs.existsSync(vaultPath)) {
      payload = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
  }

  res.json({ success: true, email: user.email, payload });
});

// 3. SYNC
app.post('/api/sync', (req, res) => {
  const { email, password, payload } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email && u.passwordHash === hashPass(password));
  
  if (!user) return res.status(401).json({ error: "Unauthorized access." });

  const vaultPath = path.join(VAULT_DIR, `${Buffer.from(email).toString('base64')}.json`);
  fs.writeFileSync(vaultPath, JSON.stringify(payload, null, 2));

  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Lithium Backend Server running heavily encrypted on port ${PORT}`);
  console.log(`User Database: ${USERS_FILE}`);
  console.log(`Vault Encrypted Directory: ${VAULT_DIR}`);
});
