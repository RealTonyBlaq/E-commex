/* App server */
import express from 'express';


const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
    return res.send('Hello World\n').status(200);
});


app.listen(port, () => {
    console.log(`Server connected and listening on http://127.0.0.1:${PORT}`);
});
