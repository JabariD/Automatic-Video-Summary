import { getYouTubeTranscript, VideoSegment } from "./youtube";

// Note: Currently, this test may need to be updated as the video may be deleted / changed from youtube.
describe("YouTubeTranscriptTest", () => {
  it("should return transcript for youtube video", async () => {
    const transcript: VideoSegment[] = await getYouTubeTranscript(
      "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    ); // Me at the zoo video.

    // remove \n from the text
    transcript.forEach((segment) => {
      segment.text = segment.text.replace(/\n/g, " ");
    });

    expect(transcript[0].text).toBe(
      "All right, so here we are in front of the elephants,"
    );
  }, 10000); // set timeout to be 10 seconds

  it("should return transcript for playlist youtube video", async () => {
    const transcript: VideoSegment[] = await getYouTubeTranscript(
      "https://www.youtube.com/watch?v=oGjXSrJrs34&list=PLR33YFXmwO30W8YdeCKbTAI6zS43IdGaf&index=4&t=319s"
    ); // Me at the zoo video.

    // remove \n from the text
    transcript.forEach((segment) => {
      segment.text = segment.text.replace(/\n/g, " ");
    });

    expect(transcript[0].text).toBe("hey youtube");
  }, 10000); // set timeout to be 10 seconds

  it("should return error because no transcript is available", async () => {
    try {
      await getYouTubeTranscript("https://www.youtube.com/watch?v=ZV7X9Q2LZjg"); // Fireplace video.

      // Fail if request is successful.
      expect(1).toBe(0);
    } catch (e) {
      expect(e.message).toBe(
        "[YoutubeTranscript] 🚨 Error: Transcript is disabled on this video"
      );
    }
  });
});
