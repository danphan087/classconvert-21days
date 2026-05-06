import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportBrain() {
    const dbPath = path.join(__dirname, '../brain.db');
    const vaultPath = path.join(__dirname, '../vault-ready');

    if (!fs.existsSync(vaultPath)) {
        fs.mkdirSync(vaultPath);
    }

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Get all tables
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    
    let totalFiles = 0;
    let totalWords = 0;
    const fileList = [];

    for (const table of tables) {
        const tableName = table.name;
        let fileName = tableName.replace(/_/g, '-') + '.md';
        
        // Custom mapping
        if (tableName === 'brand_voice') fileName = 'brand-voice.md';
        if (tableName === 'knowledge') fileName = 'knowledge-base.md';
        if (tableName === 'business') fileName = 'my-business.md';

        const rows = await db.all(`SELECT * FROM ${tableName}`);
        if (rows.length === 0) continue;

        let content = `# ${tableName.charAt(0).toUpperCase() + tableName.slice(1).replace(/_/g, ' ')}\n\n`;
        
        rows.forEach(row => {
            Object.keys(row).forEach(key => {
                const value = row[key];
                if (value) {
                    content += `## ${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}\n${value}\n\n`;
                }
            });
        });

        fs.writeFileSync(path.join(vaultPath, fileName), content);
        
        const words = content.split(/\s+/).filter(w => w.length > 0).length;
        totalWords += words;
        totalFiles++;
        fileList.push(fileName);
    }

    // Create index.md
    let indexContent = `# Index\n\n`;
    fileList.forEach(file => {
        const title = file.replace('.md', '').replace(/-/g, ' ');
        indexContent += `- [[${file}|${title}]]\n`;
    });
    
    fs.writeFileSync(path.join(vaultPath, 'index.md'), indexContent);
    totalFiles++; // account for index.md
    const indexWords = indexContent.split(/\s+/).filter(w => w.length > 0).length;
    totalWords += indexWords;

    console.log(`JSON_OUTPUT: ${JSON.stringify({ totalFiles, totalWords, fileList })}`);

    await db.close();
}

exportBrain().catch(err => {
    console.error(err);
    process.exit(1);
});
