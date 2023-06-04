/*
This uses https://www.npmjs.com/package/chatgpt-official api.

Feel free to install or uninstall.
*/

require("dotenv").config();

import { SummarizerOptions } from "../../util/interfaces";
import Util from "../../util/util";

// Google Palm API v2
const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");
// --------------------------------------------------------

var textchunk = require('textchunk');

/** Public class to any API2. */
class API2 {
  // Main entry point of API2. Returns a summary of the video. Returns an error if there is an error.
  async summarizeVideo(text: string, options: SummarizerOptions): Promise<string> {
    // Note: This must be called before any other API calls.
    this.configureGoogleAIApiClient();

    let combinedSummarizedText: string;
    try {
        combinedSummarizedText = await this.recursivelySummarize(text, options);
    } catch (error) {
        return error;
    }

    let response: string;
    try {
      response = await this.sendRequestToGoogleAIAPI(combinedSummarizedText, options);
    } catch (error) {
      return error;
    }

    return response;
  }

  // Configures the Google AI API client.
  private configureGoogleAIApiClient() {
    this.GoogleAiClient_ = new TextServiceClient({
      authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLE_API_KEY),
    });
  }

  // If text is > kTokensCutOff_, then split text into chunks of 3500 words and summarize each chunk, then combine all summaries into one summary.
  // If the combined summary is more than ktokenscutoff do the same thing until the summary is less than kTokensCutOff_. Then send to API and return response.
  private async recursivelySummarize(text: string, options: SummarizerOptions): Promise<string> {
    console.log("Entering Chunking Layer");
    const tokensInText = await this.countNumTokensGoogleAI(text);

    console.log(tokensInText);
    if (Util.isNullOrUndefined(tokensInText)) {
        return Promise.reject(new Error("Unable to count number of tokens in text."));
    }

    if (tokensInText <= this.kTokensCutOff_) {
      return text;
    }

    // convert text into array with each element being at most 3500 words
    // Note: This is very important because the API has a limit of 4000 tokens per request. This should be expected to always be less than 4000 tokens.
    // TODO(payton): This is a hacky way to split text into chunks. Find a more reliable way to do this.
    // const chunks = text.match(/\b[\s\S]{1,16000}\b/g); // averages around 3300 words
    // - pick a random number here
    // - the request can fail just for a number of reasons, so we should ask the user to retry (the longer the video/text, the more likely it has a chance to fail)
    // - the reason is we have to send multiple request if the text is longer
    // - small number, summary will be shorter, but it will be more likely to less as more requests
    // 0 large number, summary will be longer, but it will be more likely to succeed as less requests
    // to be safe, we can chunk the text by 20000 characters.
    const chunks = await textchunk.chunk(text, 20000);
    if (!chunks) {
      throw new Error(
        "Critical error occurred. Unable to split text into chunks to be sent to API."
      );
    }

    // Summarize each chunk and store in array
    let summaries: string[] = [];
    console.log("num of chunks: ", chunks.length);
    for (const chunk of chunks) {
      try {
        // TODO: Remove this log message.
        const chunkTokens = await this.countNumTokensGoogleAI(chunk);
        console.log("num of tokens in chunk: " + chunkTokens);

        const summary = await this.sendRequestToGoogleAIAPI(chunk, options);
        // sleep for 2 seconds to avoid rate limit
        await Util.Sleep(/*sec=*/2);

        summaries.push(summary);
      } catch (error) {
        console.log(error.message)
        // TODO(payton): Figure out how to handle errors if one chunk fails.
        throw error;
      }
    }

    // Combine all responses into one string
    let combinedSummaries = "";
    for (const summary of summaries) {
      combinedSummaries += summary;
    }

    return this.recursivelySummarize(combinedSummaries, options);
  }

  // Sends request to Google API and returns response or error.
  // Docs: https://developers.generativeai.google/guide/palm_api_overview and https://developers.generativeai.google/api/python/google/ai/generativelanguage/Model
  private async sendRequestToGoogleAIAPI(text: string, options: SummarizerOptions) : Promise<any> {
    if (text.length == 0) {
      throw new Error("Critical error. Text is empty.");
    }

    console.log(text);
    const tokensInText = await this.countNumTokensGoogleAI(text);

    if (tokensInText > 8000) {
      throw new Error(
        "Critical error. Text length exceeds Google API token limit. Please split text into chunks of 7800 tokens or less."
      );
    }

    const prompt = "You are summarizing one YouTube video. You are very intelligent and create very unique summaries. Feel free to pick an interesting thing said and expand upon it a bit. Try to be as helpful as possible. Summarize the following video transcription: '" + text + "'";

    let summary;
    await this.GoogleAiClient_.generateText({
      model: "models/text-bison-001",
      prompt: {
        text: prompt,
      },
      "safetySettings": [
        // See https://developers.generativeai.google/api/rest/generativelanguage/models/generateText#HarmCategory
        {"category": "HARM_CATEGORY_DEROGATORY", "threshold": "BLOCK_ONLY_HIGH"},
        {"category": "HARM_CATEGORY_VIOLENCE", "threshold": "BLOCK_ONLY_HIGH"},
        {"category": "HARM_CATEGORY_TOXICITY", "threshold": "BLOCK_ONLY_HIGH"},
      ]
    })
    .then((result) => {
      console.log(JSON.stringify(result));
      if (Util.isNullOrUndefined(result[0].candidates[0])) {
        // OUTPUT was filtered for safety.
        let reasonForBlockedOutput = "";
        for (const filter of result[0].filters) {
            reasonForBlockedOutput += filter.reason + " ";
        }
        summary = "API blocked because of " + reasonForBlockedOutput;
      } else {
        summary = result[0].candidates[0].output;
      }
    });
    return summary;
  }

  // Counts the number of tokens in text using Google AI.
  // Docs: https://developers.generativeai.google/api/rest/generativelanguage/models/countMessageTokens
  private async countNumTokensGoogleAI(text: string): Promise<number> {
    if (text.length == 0) {
      return 0;
    }

    // NOTE: This model must match the model used in the actual API.
    const url = 'https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:countMessageTokens' + `?key=${process.env.GOOGLE_API_KEY}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      'prompt': {
        "messages": [
            {"content": text},
        ]
      }
    };

    let tokens = 0;
    await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        tokens = data.tokenCount;
      });
      return tokens;
  }

  private kTokensCutOff_: number = 8000; // Note: 

  private GoogleAiClient_;
  private GoogleAiApiKey_: string = process.env.GOOGLE_API_KEY;
}

export default API2;

/*
Open questions:
1. The exact prompt to use for the API?
2. The exact settings to use for the API.
3. Handling videos that transcripts are longer than token limit: https://blog.devgenius.io/how-to-get-around-openai-gpt-3-token-limits-b11583691b32 and https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them

For reference:
console.log(response.data.choices);
console.log(response.data.choices[0].message);
console.log(typeof response.data.choices[0].message);
console.log(typeof response.data.choices[0].message?.content);

const options = {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 4096, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  instructions: `You are ChatGPT, a large language model trained by OpenAI.`, // initial instructions for the bot
  model: "gpt-3.5-turbo", // OpenAI parameter  `gpt-3.5-turbo` is PAID
};

*/
