import sqlite3, { verbose } from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

verbose();

export const initDB = () => {
    return open({
        filename: path.join(__dirname, '../data/database.sqlite3'),
        driver: sqlite3.Database,
    });
};