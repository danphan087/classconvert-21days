import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./brain.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    process.exit(1);
  }
});

db.all("SELECT name, sql FROM sqlite_master WHERE type='table';", [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.name);
    console.log(row.sql);
    console.log('---');
  });
  db.close();
});
