import { VideoSummarizer } from "./main";

/*
ACTIONS=GET_SUMMARY
ACTIONS=SUMMARIZE
*/

// TODO(payton): Convert this to express function.
exports.summarize = (req, res) => {
    const url = req.query.url;
    const email = req.body.email;
    const action = req.query.action;

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

    if (action != "GET_SUMMARY" && action != "SUMMARIZE") {
        res.status(400).json('Action was missing or malformed. You must provide a valid action.');
        return;
    }

    async function summarizeWebVideo(url: string, email: string, action: string) : Promise<string> {
        const service = new VideoSummarizer();
        const summary = await service.summarizeWebVideo(url, email, action);
        return summary;
    }

    summarizeWebVideo(url, email, action).then((summary) => {
        res.status(200).json(summary);
    }).catch((error) => {
        res.status(500).json(error.message);
    });
}

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