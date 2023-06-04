import { VideoSummarizer } from "./main";

describe("Main", () => {
    it("Open AI [Integration Test] - should return a summary", async () => {
      const service = new VideoSummarizer();
      const summary = await service.summarizeYouTubeVideo("https://www.youtube.com/watch?v=i5Jqua5pQDw", /*options=*/{prompt: "What's one funny thing about this video?"});
      console.log(summary);
  
    }, 400000); // set timeout to be 400 seconds (note this uses an API and make time to generate)

    it("Google AI API [Integration Test] - should return a summary", async () => {
      const service = new VideoSummarizer();
      const summary = await service.summarizeYouTubeVideo("https://www.youtube.com/watch?v=i5Jqua5pQDw", /*options=*/{});
      console.log(summary);
  
    }, 400000); // set timeout to be 400 seconds (note this uses an API and make time to generate)

    it("Open AI [Integration Test] - should return a summary", async () => {
      const service = new VideoSummarizer();
      const summary = await service.summarizeYouTubeVideo("https://www.youtube.com/watch?v=-c33sYO6fI4", /*options=*/{prompt: "What's one unique item about the video.", custom_api_key: ""});
      console.log(summary);
  
    }, 400000); // set timeout to be 400 seconds (note this uses an API and make time to generate)

  
  });