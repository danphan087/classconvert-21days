import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function check() {
    const db = await open({
        filename: 'brain_vps_check.db',
        driver: sqlite3.Database
    });

    const rows = await db.all("SELECT id, name, is_notified FROM customers ORDER BY id DESC LIMIT 5");
    console.log(JSON.stringify(rows, null, 2));

    await db.close();
}

check().catch(console.error);
