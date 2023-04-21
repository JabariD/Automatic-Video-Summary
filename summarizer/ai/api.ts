/*
This uses https://www.npmjs.com/package/chatgpt-official api.

Feel free to install or uninstall.


*/

require("dotenv").config();

import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { SummarizerOptions } from "../../util/interfaces";
import Util from "../../util/util";
import { encoding_for_model, Tiktoken } from "@dqbd/tiktoken";

var textchunk = require('textchunk');

class API {
  // Constructor for API class that initializes Encoder client.
  constructor() {
    this.encClient_ = encoding_for_model("gpt-3.5-turbo");
  }

  // Configures the Open AI API client.
  private configureApiClient(options: SummarizerOptions) {
    // Attempt to get API key from environment variables
    const api_key_or_error = this.getApiKey(options);
    if (api_key_or_error instanceof Error) {
      throw api_key_or_error;
    }

    const configuration = new Configuration({
      apiKey: api_key_or_error.toString(),
    });

    this.OpenAiClient_ = new OpenAIApi(configuration);
  }

  // Main entry point of API. Returns a summary of the video. Returns an error if there is an error.
  async summarizeVideo(text: string, options: SummarizerOptions): Promise<string> {
    // Note: This must be called before any other API calls.
    this.configureApiClient(options);

    // if text > tokens https://platform.openai.com/docs/guides/chat/managing-tokens
    let combinedSummarizedText: string;
    try {
      combinedSummarizedText = await this.recursivelySummarize(text, options);
    } catch (error) {
      return error;
    }

    let response: string;
    try {
      response = await this.sendRequestToAPI(combinedSummarizedText, options);
    } catch (error) {
      return error;
    }

    return response;
  }

  // If text is > kTokensCutOff_, then split text into chunks of 3500 words and summarize each chunk, then combine all summaries into one summary.
  // If the combined summary is more than ktokenscutoff do the same thing until the summary is less than kTokensCutOff_. Then send to API and return response.
  private async recursivelySummarize(text: string, options: SummarizerOptions): Promise<string> {
    console.log("Entering Chunking Layer");
    console.log("tokens in text: ", this.countNumTokens(text));
    if (this.countNumTokens(text) <= this.kTokensCutOff_) {
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
    // to be safe, we can chunk the text by 10000 characters.
    const chunks = textchunk.chunk(text, 10000);

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
        console.log("num of tokens in chunk: " + this.countNumTokens(chunk));
        const summary = await this.sendRequestToAPI(chunk, options);
        // sleep for 2 seconds to avoid rate limit
        await this.sleep(/*sec=*/1);

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

  // Returns API key from options, else return API key from environment variables.
  private getApiKey(options: SummarizerOptions): string | Error {
    // Get valid Api Key
    if (!Util.isNullOrUndefined(options.custom_api_key)) {  
      return options.custom_api_key;
    }

    return Util.isNullOrUndefined(process.env.API_KEY) ? new Error("API_KEY not found in environment variables. Please set API_KEY in .env file.") : process.env.API_KEY;
  }

  // Sends request to API and returns response or error.
  // Docs: https://platform.openai.com/docs/guides/chat/introduction
  // TODO(payton): Modify signature to return interface response.
  private async sendRequestToAPI(text: string, options : SummarizerOptions): Promise<any> {
    // Confirm meets API limit requirements. It's good to put this logic here an API call must MEET these guidelines. If it doesn't we get error.
    if (text.length == 0) {
      throw new Error("Critical error. Text is empty.");
    }

    if (this.countNumTokens(text) > 4096) {
      throw new Error(
        "Critical error. Text length exceeds API limit. Please split text into chunks of 3500 words or less."
      );
    }

    const prompt = `${Util.isNullOrUndefined(options.prompt) ? this.kDefaultPrompt_ : options.prompt}.  Here's the video transcription: '${text}'`

    const starterInstructionsAndPrompt: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content:
          "You are SummarizerGPT. You are summarizing one YouTube video. You are very intelligent and create very unique summaries. Feel free to pick an interesting thing said and expand upon it a bit. Try to be as helpful as possible.",
      },
      {
        role: "user",
        content:
          prompt,
      },
    ];

    // It's possible the API could be down. Check status here: https://status.openai.com/
    // TODO(payton): Upgrade to GPT4 when ready.
    // TODO(payton): Experiment with a different model. (hint hint Google model).
    const response = await this.OpenAiClient_.createChatCompletion({
      messages: starterInstructionsAndPrompt,
      max_tokens: this.kMaxTokensOfResponse_, // Note: Matches with kTokensCutOff_. For ref: https://platform.openai.com/docs/models/gpt-3-5
      model: this.kModel_,
      temperature: 0.9, // higher temperature = more creative, less coherent | lower temperature = less creative, more focused and deterministic
      frequency_penalty: 1.2, // positive values penalize new tokens based on existing frequency | lower values increase the likelihood of new tokens based on existing frequency
    });

    return response.data.choices[0].message?.content;
  }

  private sleep(sec: number) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
  }

  // Counts the number of tokens in text.
  // Note: Encoding must match the model used in the actual API.
  private countNumTokens(text: string): number {
    // See https://github.com/dqbd/tiktoken#readme and https://github.com/openai/openai-python/blob/main/chatml.md for more info.
    return this.encClient_.encode(text).length;
  }

  private kDefaultPrompt_ = "Summarize the following video. Be detailed and extract the key point of what was made (not just the topic). Be smart and add your own knowledge, but relevant. Use A LOT of emojis throughout the summary.";
  private kModel_ = "gpt-3.5-turbo";

  private kTokensCutOff_: number = 3400; // Note: Matches with max_tokens in SendRequestToAPI(). For ref: https://platform.openai.com/docs/models/gpt-3-5
  private kMaxTokensOfResponse_ : number = 650;

  private encClient_ : Tiktoken;
  private OpenAiClient_: OpenAIApi;
}

export default API;

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
