import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env explicitly if available
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config(); // fallback to default loading
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Inject config to client side scripts
app.get('/config.js', (req, res) => {
    res.type('application/javascript');
    res.send(`
        window.APP_CONFIG = {
            SUPABASE_URL: "${process.env.SUPABASE_URL || ''}",
            SUPABASE_KEY: "${process.env.SUPABASE_KEY || ''}",
            SEPAY_ACCOUNT_NUMBER: "${process.env.SEPAY_ACCOUNT_NUMBER || ''}"
        };
    `);
});

// Import API handlers
import automateEmails from './api/automate-emails.js';
import checkPayment from './api/check-payment.js';
import sendEmail from './api/send-email.js';

// Setup API routes mapping to the existing handlers
app.post('/api/automate-emails', async (req, res) => {
    return automateEmails(req, res);
});

app.get('/api/check-payment', async (req, res) => {
    return checkPayment(req, res);
});

app.post('/api/send-email', async (req, res) => {
    return sendEmail(req, res);
});

// Route lưu lead từ form waitlist vào brain.db
app.post('/api/save-lead', async (req, res) => {
    const { name, phone, email } = req.body;
    if (!name && !phone && !email) {
        return res.status(400).json({ error: 'Thiếu thông tin lead' });
    }
    try {
        const db = await open({
            filename: path.join(__dirname, 'brain.db'),
            driver: sqlite3.Database
        });
        await db.exec(`
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT, phone TEXT, email TEXT,
                is_notified INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // Đảm bảo cột is_notified tồn tại
        try { await db.exec("ALTER TABLE customers ADD COLUMN is_notified INTEGER DEFAULT 0"); } catch(e) {}
        await db.run(
            'INSERT INTO customers (name, phone, email, is_notified) VALUES (?, ?, ?, 0)',
            [name || null, phone || null, email || null]
        );
        await db.close();
        console.log(`[save-lead] Đã lưu lead: ${name} - ${phone} - ${email}`);
        res.json({ success: true });
    } catch (err) {
        console.error('[save-lead] Lỗi:', err);
        res.status(500).json({ error: err.message });
    }
});

// Serve main static pages correctly without extension
const pages = [
    { route: '/', file: 'index.html' },
    { route: '/thanhtoan', file: 'thanhtoan/index.html' },
    { route: '/ebook', file: 'ebook/index.html' },
    { route: '/admin', file: 'admin/index.html' }
];

pages.forEach(page => {
    app.get(page.route, (req, res) => {
        res.sendFile(path.join(__dirname, page.file));
    });
});

// Fallback for 404
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    console.log(`✅ ClassConvert server đang chạy tại http://localhost:${PORT}`);

});
