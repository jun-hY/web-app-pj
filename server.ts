import express, { Request, Response, Express } from 'express';
import { init } from './db/query';
import path from 'path';
import { reqReview } from './api/reviewApi';
import { deleteReview, parseReview, queryReview, saveReview } from './services/reviewService';

const PORT: number = 8080;
const app: Express = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.get('/', async (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', async (req: Request, res: Response) => {
    const submitCode = req.body.code;
    try {
        let reviewJson: JSON | undefined
        do {
            reviewJson = parseReview((await reqReview(submitCode)).choices[0].message.content, submitCode);
        } while (!reviewJson);
        const reviewId = await saveReview(reviewJson);
        const review = await queryReview(reviewId.toString());
        res.status(200).json(review);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: can't send to ai api");
    }
});

app.get('/getReview', async (req: Request, res: Response) => {
    const reviewId = req.query.id;
    if (reviewId) {
        try {
            const review = await queryReview(reviewId.toString());
            res.status(200).json(review);
        } catch {
            res.status(500).send("Error: can not found id");
        }
    } else {
        res.status(400).send("Error: parameter is undefined");
    }
});

app.delete('/deleteReview', async (req: Request, res: Response) => {
    const reviewId = req.query.id;
    if (reviewId) {
        try {
            const result = deleteReview(reviewId.toString());
        } catch (err) {
            res.status(500).send("Error : id not found");
        }
        res.status(200).send("delete successfully");
    } else {
        res.status(400).send("Error: parameter is undefined")
    }
});

app.listen(PORT, async () => {
    await init();
    console.log('Server is running');
});