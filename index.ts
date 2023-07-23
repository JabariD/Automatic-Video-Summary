/**
 * Entry point backend for the Google Cloud Functions.
 * 
 */

import express from 'express'; 
import { VideoSummarizer } from "./main";

const app = express();

app.use(express.json());

/** EXTENSION */

// Returns the summary for the user when on the given URL.
app.post('/ext/get-summary', (req, res) => { 
    const url = req.query.url;

    const reqBody = JSON.parse(req.body);
    const email = reqBody.email;

    // Allow CORS
    res.set('Access-Control-Allow-Origin', "*");

    if (!url || url.length === 0 || url === undefined) {
        res.status(400).json('URL was missing or malformed. Please provide a valid URL.');
        return;
    }

    if (email.length === 0 || email === undefined) {
        res.status(400).json('Email was missing or malformed. You must provide a valid email.');
        return;
    }

    async function summarizeWebVideo(url: any, email: string, action: string) : Promise<string> {
        const service = new VideoSummarizer();
        const summary = await service.summarizeWebVideo(url, email, action);
        return summary;
    }

    summarizeWebVideo(url, email, "").then((summary) => {
        res.status(200).json(summary);
    }).catch((error) => {
        res.status(500).json(error.message);
    });
});

/** CODA PACK */

/** Summarizes a YouTube video.
 * 
 * @param {string} url - The URL of the YouTube video to summarize. (In the Body)
 * @param {string} prompt - The prompt to use for the summarizer. (In the Body)
 * @param {string} apiKey - The API key to use for the summarizer. (In the Body)
 * @returns {string} The summary of the video.
 */
app.post('/summarize', async(req, res) => { 
    // Parse query params
    const url : string = req.body.url;
    const prompt : string = req.body.prompt;
    const apiKey : string = req.body.apiKey;

    // Allow CORS
    res.set('Access-Control-Allow-Origin', "*");

    const service = new VideoSummarizer();

    try {
        const summary = await service.summarizeYouTubeVideo(url, /*summarizer_options=*/{prompt: prompt, custom_api_key: apiKey});
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

exports.summarize = app;

/*
gcloud functions deploy summarizer-gcloud-func --gen2 --region=us-central1 --runtime=nodejs18 --source=./dist --entry-point=summarize

gcloud functions deploy summarizer-function \
[--gen2] \
--region=us-central1 \
--runtime=nodejs18 \
--source=./dist \
--entry-point=summarize \
TRIGGER_FLAGS

gcloud functions deploy summarizer-function --gen2 --region=us-central1 --runtime=nodejs18 --source=./dist --entry-point=summarize


*/