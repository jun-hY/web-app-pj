import { initDB } from "./database"


export const init = async () => {
    const db = await initDB();

    // db.exec()를 사용하여 비동기적으로 쿼리 실행
    await db.exec(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY,
            advantage TEXT NOT NULL,
            improve TEXT NOT NULL,
            point TEXT NOT NULL,
            summary TEXT NOT NULL,
            improved_code TEXT NOT NULL
        )
    `);

    console.log('Database tables initialized');
};

export const connectDB = async () => {
    const db = await initDB();

    const getReview = async (id: string) => {
        return await db.get('SELECT * FROM reviews WHERE id = ?', id)
    }

    const createReview = async (id: string) => {
        if (await getReview(id)) {
            return
        }
        await db.run('INSERT INTO boards (id, advantage, improve, point, summary, improved_code) VALUES(?, ?, ?, ?, ?, ?) ', [])
    }

    return {
        getReview,
        createReview
    }
}