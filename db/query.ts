import { initDB } from "./database"


export const init = async () => {
    const db = await initDB();

    // db.exec()를 사용하여 비동기적으로 쿼리 실행
    await db.exec(`
        CREATE TABLE IF NOT EXISTS reviews (
            date TEXT NOT NULL default (datetime('now', 'localtime')),
            id TEXT PRIMARY KEY,
            issues TEXT NOT NULL,
            improvements TEXT NOT NULL,
            scores TEXT NOT NULL,
            summary TEXT NOT NULL,
            improved_code TEXT NOT NULL
        )
    `);

    console.log('Database tables initialized');
};

export const connectDB = async () => {
    const db = await initDB();

    const getReview = async (id: string) => {
        return await db.get('SELECT * FROM reviews WHERE id = ?', [id])
    }

    const createReview = async (id: string, jsonData: Record<string, any>) => {
        if (await getReview(id)) {
            return
        }
        await db.run('INSERT INTO reviews (id, issues, improvements, scores, summary, improved_code) VALUES(?, ?, ?, ?, ?, ?) ', [id, JSON.stringify(jsonData.issues), JSON.stringify(jsonData.improvements), JSON.stringify(jsonData.scores), jsonData.summary, jsonData.improved_code])
    }

    const deleteReview = async (id: string): Promise<boolean> => {
        const result = await db.run('DELETE FROM reviews WHERE id=?', [id])
        return result.changes !== 0;
    }

    return {
        getReview,
        createReview,
        deleteReview
    }
}