import { VideoSummarizer } from "./main";

describe("Main", () => {
    it("[Integration Test] - should return a summary", async () => {
      const service = new VideoSummarizer();
      const summary = await service.summarizeWebVideo("https://www.youtube.com/watch?v=TZG27KBopxg");
      console.log(summary);
  
    }, 400000); // set timeout to be 400 seconds (note this uses an API and make time to generate)

  
  });