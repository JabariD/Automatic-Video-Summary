/*
This uses https://www.npmjs.com/package/chatgpt-official api.

Feel free to install or uninstall.


*/

require("dotenv").config();

import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

class API {
  // Constructor for API class that initializes OpenAI client.
  constructor() {
    // Attempt to get API key from environment variables
    const api_key_or_error = this.getApiKey();
    if (api_key_or_error instanceof Error) {
      throw api_key_or_error;
    }

    const configuration = new Configuration({
      apiKey: api_key_or_error.toString(),
    });

    this.OpenAiClient_ = new OpenAIApi(configuration);
  }

  // Main entry point of API. Returns a summary of the video. Returns an error if there is an error.
  async summarizeVideo(text: string): Promise<string> {
    let response: string;
    try {
      response = await this.sendRequestToAPI(text);
    } catch (error) {
      return error;
    }

    return response;
  }

  // Returns API key from environment variables or error if not found.
  private getApiKey(): string | Error {
    return process.env.API_KEY
      ? process.env.API_KEY
      : new Error(
          "API_KEY not found in environment variables. Please set API_KEY in .env file."
        );
  }

  // Sends request to API and returns response or error.
  // Docs: https://platform.openai.com/docs/guides/chat/introduction
  // TODO(payton): Change signature to sendRequestToAPI(createChatCompletionRequest(systemMessage, message), modelOptions);
  // TODO(payton): Modify signature to return interface response.
  private async sendRequestToAPI(text: string): Promise<any> {
    const messages: ChatCompletionRequestMessage[] = [
      { role: "system", content: "You are a helpful assistant" },
      {
        role: "user",
        content: "Can you summarize this: " + text + "?",
      },
    ];

    const response = await this.OpenAiClient_.createChatCompletion({
      messages,
      model: "gpt-3.5-turbo",
    });

    return response.data.choices[0].message?.content;
  }

  private OpenAiClient_: OpenAIApi;
}

export default API;

/*
Open questions:
1. The exact prompt to use for the API?
2. The exact settings to use for the API.
3. Handling videos that transcripts are longer than token limit: https://blog.devgenius.io/how-to-get-around-openai-gpt-3-token-limits-b11583691b32

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
