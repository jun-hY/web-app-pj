import express, { Express, Request, Response } from 'express'
import { initDb } from "./db/query";

import path from 'path';

const PORT: number = 8080;
const app: Express = express();

initDb();

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req: Request, res: Response) => {

});

app.listen(PORT, () => {
    console.log('Server is running');
});