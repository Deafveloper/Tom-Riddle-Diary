const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
// const { Configuration, OpenAIApi } = require('openai');
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI();

// Serve static files from root
app.use(express.static(path.join(__dirname, '/')));

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {

        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: userMessage }
            ],
            model: "gpt-3.5-turbo",
          });

        // const response = await openai.createChatCompletion({
        //     model: "gpt-3.5-turbo",
        //     messages: [
        //         { role: "system", content: "You are Tom Riddle." },
        //         { role: "user", content: userMessage }
        //     ],
        // });

        const reply = response.data.choices[0].message.content;
        res.json({ response: reply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
