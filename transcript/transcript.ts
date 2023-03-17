import { getYouTubeTranscript, VideoSegment } from "./youtube/youtube";

// The Transcript class handles retrieving the transcript for the url video passed in.
// Note: Currently only supports youtube videos
class Transcript {
  // Gets the transcript for the youtube video from the url passed in and converts it common format.
  // Note: Main will call this function to get the transcript. So this should be treated as a "black box".
  async getTranscript(url: string): Promise<VideoSegment[]> {
    // The transcripts of the video must be gotten successfully to continue, therefore we let error be thrown.
    return await getYouTubeTranscript(url);
  }

  // Converts the transcript to a common format
  // Currently unused as the only source is YouTube.
  private convertTranscriptToCommonFormat(transcript: any): any {
    return transcript;
  }
}

export { Transcript };
