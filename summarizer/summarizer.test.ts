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
      { text: "foo-bar    \n @", duration: 3000, offset: 0 },
      { text: "normalized", duration: 3000, offset: 3000 },
      { text: "     checker,@  \n", duration: 3000, offset: 6000 },
    ];

    // TODO(JabariD): Refactor this to use the Summarizer class instead of the Summarizer class's private methods. (https://dev.to/danywalls/testing-private-methods-in-typescript-3np5)
    const sanitizedText = new Summarizer()["normalizeText"](videoSegments);

    expect(sanitizedText).toBe("foo-bar normalized checker,");
  });
});
