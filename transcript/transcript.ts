import {getYouTubeTranscript, VideoSegment} from './youtube/youtube';

// The Transcript class handles retrieving the transcript for the url video passed in.
// Note: Currently only supports youtube videos
class Transcript {
    // Gets the transcript for the youtube video from the url passed in and converts it common format.
    // Note: Main will call this function to get the transcript. So this should be treated as a "black box".
    getTranscript(url: string): VideoSegment[] {
        const transcript: VideoSegment[] = this.getTranscriptFromUrl(url);
        return this.convertTranscriptToCommonFormat(transcript);
    }

    private getTranscriptFromUrl(url: string): any {
        const transcript = {
            "transcript": [
                {
                    "start": 0.0,
                    "duration": 1.0,
                    "text": "Hello World!"
                },
                {
                    "start": 1.0,
                    "duration": 2.0,
                    "text": "Hello World!"
                },
                {
                    "start": 2.0,
                    "duration": 3.0,
                    "text": "Hello World!"
                }
            ]
        };
        return transcript;
    }
    
    // Converts the transcript to a common format
    // Currently unused as the only source is YouTube.
    private convertTranscriptToCommonFormat(transcript: any): any {
        return transcript;
    }

}

export { Transcript };
  