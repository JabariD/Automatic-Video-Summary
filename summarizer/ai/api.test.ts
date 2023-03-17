import  API  from "./api";

describe ("API", () => { 
  it ("should return a summary", async () => { 
    const api = new API(); 
    const summary = await api.summarizeVideo("All right, so here we are in front of the, uh, elephants, and the cool thing about these guys is that, is that they have really, really, really long, um, trunks, and that's, that's cool, and that's pretty much all there is to say."); 
    console.log(summary);

    // Honestly if the summary does not have the word "elephants" or "trunks" in it, it is probably not a good summary. Therefore we should be able to check for those words and it's likely to not make the case flaky.
    expect(summary).toContain("elephants");
    expect(summary).toContain("trunks");


  }, 30000); // set timeout to be 30 seconds (note this uses an API and make time to generate)
});

