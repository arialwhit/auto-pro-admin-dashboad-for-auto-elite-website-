import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("autopro.db");

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'admin'
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    make TEXT,
    model TEXT,
    year INTEGER,
    mileage INTEGER,
    price REAL,
    status TEXT DEFAULT 'available',
    condition TEXT,
    images TEXT, -- JSON array
    description TEXT,
    featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    booking_date TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
  );

  CREATE TABLE IF NOT EXISTS financing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER,
    customer_name TEXT,
    customer_email TEXT,
    income REAL,
    credit_score TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0
  );
`);

// Seed default admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", "admin123", "super_admin");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API ROUTES ---

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Vehicles
  app.get("/api/vehicles", (req, res) => {
    const vehicles = db.prepare("SELECT * FROM vehicles").all();
    res.json(vehicles.map(v => ({ ...v, images: JSON.parse(v.images || "[]") })));
  });

  app.post("/api/vehicles", (req, res) => {
    const { title, make, model, year, mileage, price, status, condition, images, description, featured } = req.body;
    const result = db.prepare(`
      INSERT INTO vehicles (title, make, model, year, mileage, price, status, condition, images, description, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, make, model, year, mileage, price, status, condition, JSON.stringify(images), description, featured ? 1 : 0);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/vehicles/:id", (req, res) => {
    db.prepare("DELETE FROM vehicles WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Bookings
  app.get("/api/bookings", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, v.title as vehicle_title 
      FROM bookings b 
      JOIN vehicles v ON b.vehicle_id = v.id
    `).all();
    res.json(bookings);
  });

  app.patch("/api/bookings/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // Financing
  app.get("/api/financing", (req, res) => {
    const applications = db.prepare(`
      SELECT f.*, v.title as vehicle_title 
      FROM financing f 
      JOIN vehicles v ON f.vehicle_id = v.id
    `).all();
    res.json(applications);
  });

  // Messages
  app.get("/api/messages", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
    res.json(messages);
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const updates = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const [key, value] of Object.entries(updates)) {
      stmt.run(key, String(value));
    }
    res.json({ success: true });
  });

  app.post("/api/settings/test-email", (req, res) => {
    const { smtpHost, smtpPort, smtpUser, senderEmail } = req.body;
    
    // Simulate email sending logic
    console.log(`Sending test email via ${smtpHost}:${smtpPort} for ${smtpUser} to ${senderEmail}`);
    
    // In a real app, you'd use nodemailer here.
    // We'll simulate a 1-second delay and then return success.
    setTimeout(() => {
      res.json({ success: true, message: `Test email successfully sent to ${senderEmail}` });
    }, 1000);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
