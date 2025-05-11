import db from "./database"

export const initDb = (): void => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS boards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )`);
    });
};

