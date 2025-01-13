/* App server */
import express from 'express';
import router from './routes/index.js';
import connectDB from './utils/db.js';
import { config } from 'dotenv';

config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
    return res.send('Hello World\n').status(200);
});

app.listen(PORT, () => {
    console.log(`Server connected and listening on http://127.0.0.1:${PORT}`);
});
