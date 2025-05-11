import sqlite3 from "sqlite3";
import path from "path";

sqlite3.verbose();

const dbPath = path.join(__dirname, '../data/database.sqlite3'); // DB 파일 위치
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

export default db;