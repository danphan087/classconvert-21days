import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

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
    console.log(\`✅ ClassConvert server đang chạy tại http://localhost:\${PORT}\`);
});
