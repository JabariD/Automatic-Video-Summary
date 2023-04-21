import { Summarizer } from "./summarizer";
import { VideoSegment } from "../transcript/youtube/youtube";

describe("Summarizer", () => {
  it("should normalize text", async () => {
    const videoSegments: VideoSegment[] = [
      {
        text: "All right, so here we are in front of the elephants,\n    very cool",
        duration: 3000,
        offset: 0,
      },
    ];

    // TODO(JabariD): Refactor this to use the Summarizer class instead of the Summarizer class's private methods. (https://dev.to/danywalls/testing-private-methods-in-typescript-3np5)
    const sanitizedText = new Summarizer()["normalizeText"](videoSegments);

    expect(sanitizedText).toBe(
      "All right, so here we are in front of the elephants, very cool"
    );
  });

  it("should normalize multiple segments", async () => {
    const videoSegments: VideoSegment[] = [
      {
        text: "access to it would have to be a really",
        duration: 4320,
        offset: 179400,
      },
      {
        text: "great video yeah yeah right individual",
        duration: 4500,
        offset: 181319,
      },
      {
        text: "video yeah I well that's why it's there",
        duration: 3239,
        offset: 183720,
      },
    ];

    // TODO(JabariD): Refactor this to use the Summarizer class instead of the Summarizer class's private methods. (https://dev.to/danywalls/testing-private-methods-in-typescript-3np5)
    const sanitizedText = new Summarizer()["normalizeText"](videoSegments);

    expect(sanitizedText).toBe(
      "access to it would have to be a really great video yeah yeah right individual video yeah I well that's why it's there"
    );
  });

  it("should normalize multiple segments with invalid characters", async () => {
    const videoSegments: VideoSegment[] = [
      { text: "foo-bar    \n @", duration: 3000, offset: 0 },
      { text: "normalized", duration: 3000, offset: 3000 },
      { text: "     checker,@  \n", duration: 3000, offset: 6000 },
    ];

    // TODO(JabariD): Refactor this to use the Summarizer class instead of the Summarizer class's private methods. (https://dev.to/danywalls/testing-private-methods-in-typescript-3np5)
    const sanitizedText = new Summarizer()["normalizeText"](videoSegments);

    expect(sanitizedText).toBe("foo-bar normalized checker,");
  });

  it("should summarize video segments", async () => {
    const videoSegments: VideoSegment[] = [
      {
        text: "All right, so here we are in front of the, uh, elephants   \n",
        duration: 3000,
        offset: 0,
      },
      {
        text: ", and the cool thing about these guys is that, is that they have really, really",
        duration: 6000,
        offset: 3000,
      },
      {
        text: ", really long, um, trunks, and that's, that's cool, and that's pretty much all there is to say.",
        duration: 9000,
        offset: 6000,
      },
    ];

    const summarizer = new Summarizer();
    const summary = await summarizer.getSummary(videoSegments, /*options=*/{});

    console.log(summary);

    expect(summary).toContain("elephants");
  }, 100000);
});
