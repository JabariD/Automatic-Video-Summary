import { Summarizer } from "./summarizer/summarizer";
import { Transcript } from "./transcript/transcript";
import { SourceValidator } from "./valid_source/source_validator";
import { UserValidator } from "./valid_user/user_validator";
import { Database } from "./db/database";

import { SummarizerOptions } from "./util/interfaces";

// The main entry point for the system. This class is responsible for handling all the series of functions.
class EntryPoint {
  // Initialize the clients
  constructor() {
    this.userValidatorClient_ = new UserValidator();
    this.sourceValidatorClient_ = new SourceValidator();
    this.transcriptClient_ = new Transcript();
    this.summarizerClient_ = new Summarizer();

    this.dbClient_ = new Database();
  }

  // Summarizes a YouTube video given the url and options.
  async summarizeYouTubeVideo(url: string, options: SummarizerOptions): Promise<string> {
    // Check source
    if (!this.sourceValidatorClient_.isValid(url)) {
      throw new Error("Invalid URL. The URL must be a YouTube URL with an ID.");
    } 

    // Check transcript
    console.log("Getting transcript...");
    let transcript;
    try {
      transcript = await this.transcriptClient_.getTranscript(url);
    } catch (error) {
      throw new Error("Error in getting transcript: " + error.message);
    }

    // Summarize the video
    console.log("Summarizing video.");
    return await this.summarizerClient_.getSummary(transcript, options);
  }

  async summarizeWebVideo(url: string, email: string, action: string): Promise<string> {
    if (action === "GET_SUMMARY") {
      return await this.dbClient_.getSummaryForUser(email, url);
    }

    console.log("Summarizing video: " + url);

    // Check source
    if (!this.sourceValidatorClient_.isValid(url)) {
      throw new Error("Invalid URL. The URL must be a YouTube URL with an ID.");
    }

    // Check user
    try {
      console.log("Validating user...");
      const isValid = await this.userValidatorClient_.validate(email);
      if (!isValid) {
        throw new Error("Invalid user. The user must be a valid subscriber.");
      }
    } catch (error) {
      throw new Error("Error in validating user: " + error.message);
    }

    // Get transcript
    let transcript;
    try {
      console.log("Getting transcript...");
      transcript = await this.transcriptClient_.getTranscript(url);
    } catch (error) {
      await this.dbClient_.setSummaryForUser(email, url, error.message);
      throw new Error("Error in getting transcript: " + error.message);
    }

    // Get summary and set summary in DB
    try {
      console.log("Getting summary...");
      const summary = await this.summarizerClient_.getSummary(transcript, {});
      await this.dbClient_.setSummaryForUser(email, url, summary);
      return summary;
    } catch (error) {
      console.log(error);
      await this.dbClient_.setSummaryForUser(email, url, error.message);
      throw new Error("Error in getting/setting summary: " + error.message);
    }
  }

  private userValidatorClient_: UserValidator;
  private sourceValidatorClient_: SourceValidator;
  private transcriptClient_: Transcript;
  private summarizerClient_: Summarizer;
  private dbClient_: Database;
}

export { EntryPoint as VideoSummarizer };

/*
Observations:
- Note: Make sure to change the URL in code.
- run the test by doing npx jest -t Main

- Note: Not an exact science. These also depend on how much the user is speaking. If the user is speaking a lot, then the summary will be longer.


- Manual testing...
- Pay wall guard against API calls
- We absolutely need to chunk the video into smaller chunks.
- Use title as way to understand the context.
- Video must have captions
- Have 3 levels of summarization: short, medium, long. This will instruct the API how long,detailed the summary should be.

*/

/*
Open Questions:
1. Where would it be deployed? 
- (AWS, GCP, Azure, Heroku, etc.) 
- As a cloud function?

2: Possibly migrate test to start mocking the API calls.

// Fill in README. of this information.
Files to include in zip file to AWS Elastic Beanstalk:
- dist
- gitignore
- package.json
- package-lock.json
- tsconfig.json
*/