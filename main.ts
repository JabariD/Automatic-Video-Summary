import { Summarizer } from './summarizer/summarizer';
import { Transcript } from './transcript/transcript';
import { SourceValidator }  from './valid_source/source_validator';

// The main entry point for the system. This class is responsible for handling all the series of functions.
class EntryPoint {
  constructor() {
    // Initialize the clients
    this.sourceValidatorClient_ = new SourceValidator();
    this.transcriptClient_ = new Transcript();
    this.summarizerClient_ = new Summarizer();
  }

  async summarizeWebVideo(url: string): Promise<string> {
    if (!this.sourceValidatorClient_.isValid(url)) {
      throw new Error("Invalid URL. The URL must be a YouTube URL with an ID.");
    }

    let transcript;
    try {
      transcript = await this.transcriptClient_.getTranscript(url); 
    } catch (error) {
      throw new Error("Error in getting transcript: " + error.message);
    }

    try {
      const summary = await this.summarizerClient_.getSummary(transcript);
      return summary;
    } catch (error) {
      console.log(error);
      throw new Error("Error in getting summary: " + error.message);
    }
  }

  private sourceValidatorClient_ : SourceValidator;
  private transcriptClient_ : Transcript;
  private summarizerClient_ : Summarizer;
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