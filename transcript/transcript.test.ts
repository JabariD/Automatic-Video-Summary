import { Transcript } from "./transcript";
import { VideoSegment } from "./youtube/youtube";

describe("Transcript", () => {
  // should return true for me at the zoo video
  it("should get segments for youtube video", async () => {
    const transcript = new Transcript();
    const videoSegments: VideoSegment[] = await transcript.getTranscript(
      "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    );

    videoSegments.forEach((segment) => {
      segment.text = segment.text.replace(/\n/g, " ");
    });

    expect(videoSegments[0].text).toBe(
      "All right, so here we are in front of the elephants,"
    );
  });

  it("should get error for youtube video without subtitles", async () => {
    try {
      const transcript = new Transcript();
      await transcript.getTranscript(
        "https://www.youtube.com/watch?v=Xl57VFgopk8"
      ); // fireplace video
    } catch (e) {
      expect(e.message).toBe(
        "[YoutubeTranscript] 🚨 Error: Transcript is disabled on this video"
      );
    }
  });
});
