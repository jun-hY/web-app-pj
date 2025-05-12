import { randomBytes } from "crypto"
import { connectDB } from "../db/query"

export const parseReviewData = (data: string) => {
    try {
        const jsonData = JSON.parse(data.split('\`\`\`')[1].replace('json\n', ''))
        if (jsonData) {
            return jsonData
        }
    } catch (e) {
        console.error(e)
    }
}

export const saveReview = async (jsonData: Record<string, any>) => {
    const db = await connectDB();
    const id = randomBytes(20).toString('hex')
    db.createReview(id, jsonData)
    return id
}

export const queryReview = async (id: string) => {
    const db = await connectDB();
    const reviewData = await db.getReview(id)
    return reviewData
}