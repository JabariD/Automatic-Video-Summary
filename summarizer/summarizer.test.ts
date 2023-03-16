import { Summarizer } from "./summarizer";
import { VideoSegment } from "../transcript/youtube/youtube";

describe("Summarizer", () => {
  it("should normalize text", async () => {
    const summarizer = new Summarizer();
    const videoSegments: VideoSegment[] = [
      { text: "All right, so here we are in front of the elephants,\n    very cool" , duration: 3000, offset: 0 },
    ];
    const summary = await summarizer.getSummary(videoSegments);
    expect(summary).toBe(
      "All right, so here we are in front of the elephants, very cool"
    );
  });
});
