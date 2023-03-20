// Node.js express server
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

import { VideoSummarizer } from "./main";

async function summarizeWebVideo(url: string) : Promise<string> {
    const service = new VideoSummarizer();
    const summary = await service.summarizeWebVideo(url);
    return summary;
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// add route to get url from request and send to video summarizer
app.get('/summary', async(req, res) => {
    const url = req.query.url;

    if (!url) {
        res.status(400).send('Missing URL');
        return;
    }

    try {
        const summary = await summarizeWebVideo(url);
        res.status(200).send(summary);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
  

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})