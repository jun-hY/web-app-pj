import express, { Request, Response, Express } from 'express';
import { init } from './db/query';
import path from 'path';
import { reqReview } from './api/reviewApi';
import { parseReviewData, queryReview, saveReview, view } from './services/reviewService';

const PORT: number = 8080;
const app: Express = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.get('/', async (req: Request, res: Response) => {
    const reviewId = req.query.id;
    if (reviewId) {
        const review = await queryReview(reviewId.toString())
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.post('/', async (req: Request, res: Response) => {
    try {
        const reviewData = await reqReview(req.body.code)
        const reviewJsonData = parseReviewData(reviewData.choices[0].message.content)
        const reviewId = await saveReview(reviewJsonData)
        res.status(200).json({ redirect: `/?id=${reviewId}` });
    } catch (err) {
        console.error(err)
        res.status(500).send("Error: can't send to ai api")
    }
});

app.listen(PORT, async () => {
    await init();
    console.log('Server is running');
});