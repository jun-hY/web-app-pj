import { randomBytes } from "crypto"
import { connectDB } from "../db/query"

export const parseReview = (data: string, origin_code: string): JSON | undefined => {
    try {
        const jsonData = JSON.parse(data.split('\`\`\`')[1].replace('json\n', ''));
        jsonData.origin_code = origin_code;
        if (jsonData) {
            return jsonData
        }
    } catch (e) {
        console.error('Error : Ai가 json 형식에 맞춰 반환하지 않았습니다. 재시도합니다.')
        return
    }
}

export const saveReview = async (jsonData: Record<string, any>) => {
    const db = await connectDB();
    let id: string | undefined;
    do {
        id = await db.createReview(randomBytes(20).toString('hex'), jsonData);
    } while (!id)
    return id
}

export const queryReview = async (id: string) => {
    const db = await connectDB();
    const reviewData = await db.getReview(id)
    return reviewData
}

export const deleteReview = async (id: string) => {
    const db = await connectDB();
    const result = await db.deleteReview(id);
    return result
}