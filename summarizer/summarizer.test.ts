import { Summarizer } from "./summarizer";
import { VideoSegment } from "../transcript/youtube/youtube";

describe("Summarizer", () => {
  it("should normalize text", async () => {
    const summarizer = new Summarizer();
    const videoSegments: VideoSegment[] = [
      {
        text: "All right, so here we are in front of the elephants,\n    very cool",
        duration: 3000,
        offset: 0,
      },
    ];
    const summary = await summarizer.getSummary(videoSegments);
    expect(summary).toBe(
      "All right, so here we are in front of the elephants, very cool"
    );
  });

  it("should normalize multiple segments", async () => {
    const summarizer = new Summarizer();
    const videoSegments: VideoSegment[] = [
      { text: "foo-bar    \n @", duration: 3000, offset: 0 },
      { text: "normalized", duration: 3000, offset: 3000 },
      { text: "     checker,@  \n", duration: 3000, offset: 6000 },
    ];
    const summary = await summarizer.getSummary(videoSegments);
    expect(summary).toBe("foo-bar normalized checker,");
  });
});
