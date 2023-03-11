/*
This package uses the following package to get the transcript from youtube: https://www.npmjs.com/package/youtube-transcript

Install by using: npm install youtube-transcript
If needed, uninstall it by using: npm uninstall youtube-transcript

It returns the transcript in the following format:
[
    { text: 'over here', duration: 3301, offset: 798139 },
    { text: 'all right relax', duration: 3480, offset: 831380 },
    ...
]

*/

const YoutubeTranscript = require('youtube-transcript').default;

// TODO(paytondennis): Move interface to common folder and file.
// This interface defines 1 segment of the transcript
interface VideoSegment {
    text: string; // The text of the segment
    duration: number; // The duration of the segment in milliseconds    
    offset: number; // The offset of the segment in milliseconds from the start of the video
}

async function getYouTubeTranscript(url: string): Promise<VideoSegment[]>  {
    const transcript : VideoSegment[] = await YoutubeTranscript.fetchTranscript(url);
    return transcript;
}

export { getYouTubeTranscript, VideoSegment };
