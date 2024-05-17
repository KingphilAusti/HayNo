const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const processMessage = require('./answer');

app.use(cors()); // Add this line to enable CORS

app.get('/send-message', async (req, res) => {
    const message = req.query.message;
    if (!message) {
        res.status(400).send({ error: 'No message received' });
    } else {
        const answer = await processMessage(message);
        res.send({ question: message, answer: answer });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

