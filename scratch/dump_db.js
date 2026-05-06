import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function dumpDb() {
    const db = await open({
        filename: 'brain.db',
        driver: sqlite3.Database
    });

    console.log("--- TABLES ---");
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log(tables.map(t => t.name).join(', '));

    for (const table of tables) {
        console.log(`\n--- CONTENT OF ${table.name} ---`);
        const rows = await db.all(`SELECT * FROM ${table.name} LIMIT 10`);
        console.log(JSON.stringify(rows, null, 2));
    }

    await db.close();
}

dumpDb().catch(console.error);
