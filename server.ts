import express, { Request, Response, Express } from 'express';
import { init } from './db/query';
import path from 'path';
import { reqReview } from './api/reviewApi';
import { parseReview, queryReview, saveReview } from './services/reviewService';

const PORT: number = 8080;
const app: Express = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('view engine', 'pug')
app.set('views', '')

app.get('/', async (req: Request, res: Response) => {
    res.render('index');
});

app.post('/', async (req: Request, res: Response) => {
    const reviewId = req.body.id;
    if (reviewId) {
        try {
            const review = await queryReview(reviewId.toString());
            res.status(200).json(review);
        } catch {
            res.status(500).send("Error: can not found id")
        }
    } else if (req.body.code) {
        try {
            const reviewData = await reqReview(req.body.code)
            const reviewJson = parseReview(reviewData.choices[0].message.content)
            const reviewId = await saveReview(reviewJson)
            res.status(200).json({ redirect: `${reviewId}` });
        } catch (err) {
            console.error(err)
            res.status(500).send("Error: can't send to ai api")
        }
    }
});

app.listen(PORT, async () => {
    await init();
    console.log('Server is running');
});