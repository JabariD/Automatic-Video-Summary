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
  });
});
