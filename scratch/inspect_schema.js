import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getSchema() {
    const db = await open({
        filename: 'brain.db',
        driver: sqlite3.Database
    });

    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    
    for (const table of tables) {
        console.log(`\n--- SCHEMA OF ${table.name} ---`);
        const schema = await db.all(`PRAGMA table_info(${table.name})`);
        console.table(schema);
    }

    await db.close();
}

getSchema().catch(console.error);
