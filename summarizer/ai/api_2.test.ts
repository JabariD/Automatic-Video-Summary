import API2 from "./api_2";

// TODO(payton): Fix flaky test because API2 returns different results each time.
describe("API2", () => {
  it("should return a summary of simple text", async () => {
    const api = new API2();
    const text = "All right, so here we are in front of the, uh, elephants, and the cool thing about these guys is that, is that they have really, really, really long, um, trunks, and that's, that's cool, and that's pretty much all there is to say.";
    const summary = await api.summarizeVideo(text, /*options=*/{});
    console.log(summary);

    // Honestly if the summary does not have the word "elephants" or "trunks" in it, it is probably not a good summary. Therefore we should be able to check for those words and it's likely to not make the case flaky.
    expect(summary).toContain("elephants");
    expect(summary).toContain("trunks");
  }, 30000); // set timeout to be 30 seconds (note this uses an API and make time to generate)

  it("should return a summary of more complex text", async () => {
    const api = new API2();
    const text =
      "When the day of Pentecost came, they were all together in one place. Suddenly a sound like the blowing of a violent wind came from heaven and filled the whole house where they were sitting. They saw what seemed to be tongues of fire that separated and came to rest on each of them. All of them were filled with the Holy Spirit and began to speak in other tongues as the Spirit enabled them. Now there were staying in Jerusalem God-fearing Jews from every nation under heaven. When they heard this sound, a crowd came together in bewilderment, because each one heard their own language being spoken. Utterly amazed, they asked: “Aren’t all these who are speaking Galileans? Then how is it that each of us hears them in our native language? Parthians, Medes and Elamites; residents of Mesopotamia, Judea and Cappadocia, Pontus and Asia, Phrygia and Pamphylia, Egypt and the parts of Libya near Cyrene; visitors from Rome (both Jews and converts to Judaism); Cretans and Arabs—we hear them declaring the wonders of God in our own tongues!” Amazed and perplexed, they asked one another, “What does this mean?”";
    const summary = await api.summarizeVideo(text, /*options=*/{});
    console.log(summary);

    // Expect words that more than likely is in the summary
    expect(summary).toContain("Pentecost");
  }, 30000); // set timeout to be 30 seconds (note this uses an API and make time to generate)

//   // Note: This test should be last because it resets the API key.
//   it("should return error for invalid API key", async () => {
//     try {
//     process.env.API_KEY = "";
//     const api = new API2();
//     await api.summarizeVideo("foo", /*options=*/{});
//     // This should throw an error because the API key is invalid.
//       throw new Error("The test did not throw an error.");
//     } catch (e) {
//       expect(e.message).toContain("API_KEY not found");
//     }
//   });

//   it("should return a summary of simple text with a custom api key", async () => {
//     process.env.API_KEY = "";
//     const api = new API2();
//     const text = "All right, so here we are in front of the, uh, elephants, and the cool thing about these guys is that, is that they have really, really, really long, um, trunks, and that's, that's cool, and that's pretty much all there is to say.";
//     const summary = await api.summarizeVideo(text, /*options=*/{custom_api_key: "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"});
//     console.log(summary);
    
//     expect(summary).toContain("elephants");
//   }, 30000);
});
