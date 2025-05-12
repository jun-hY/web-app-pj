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

export const view = (jsonData: Record<string, any>) => {
    console.log(jsonData.issues)
    console.log(jsonData.improvements)
    console.log(jsonData.scores)
    console.log(jsonData.summary)
    console.log(jsonData.improved_code)
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