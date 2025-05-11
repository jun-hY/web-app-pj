import db from "./database"

export const initDb = (): void => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS boards (
            id INTEGER PRIMARY KEY,
            advantage TEXT NOT NULL,
            improve TEXT NOT NULL,
            point TEXT NOT NULL,
            summary TEXT NOT NULL,
            improved_code TEXT NOT NULL
        )`);
    }); 
};

