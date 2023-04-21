import { VideoSummarizer } from "./main";

describe("Main", () => {
    it("[Integration Test] - should return a summary", async () => {
      const service = new VideoSummarizer();
      const summary = await service.summarizeYouTubeVideo("https://www.youtube.com/watch?v=oEtroSGcIhk", /*options=*/{});
      console.log(summary);
  
    }, 400000); // set timeout to be 400 seconds (note this uses an API and make time to generate)

    it("[Integration Test] - should return a summary", async () => {
      const service = new VideoSummarizer();
      const summary = await service.summarizeYouTubeVideo("https://www.youtube.com/watch?v=oEtroSGcIhk", /*options=*/{prompt: "What's one unique item about the video.", custom_api_key: ""});
      console.log(summary);
  
    }, 400000); // set timeout to be 400 seconds (note this uses an API and make time to generate)

  
  });