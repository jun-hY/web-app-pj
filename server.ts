import express, { Express, Request, Response } from 'express'

const PORT: number = 8080;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('typescript test')
})

app.listen(PORT, () => {
    console.log('Server is running');
})