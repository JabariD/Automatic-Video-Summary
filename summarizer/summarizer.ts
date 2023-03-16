import { VideoSegment } from '../transcript/youtube/youtube';

// Summarizer 
class Summarizer {
    
    // Public function to summarize the video segments. Returns Error if there is an error in the summarization process.
    async getSummary(videoSegments: VideoSegment[]): Promise<string> {
        try {
            return this.summarize(videoSegments);
        } catch (error) {
            return error;
        }
    }

    // Process to summarize a video.
    private async summarize(videoSegments: VideoSegment[]) : Promise<string> {
        // Normalizes the video segments.
        const sanitizedText : string = this.normalizeText(videoSegments);

        return sanitizedText;
    }

    // Returns a normalized (i.e. no special characters, no extra spaces) string of the text in the video segments.
    private normalizeText(videoSegments: VideoSegment[]) : string{
        // Concatenate all the `text` fields of the `textSegments` array into a single string
        const text = videoSegments.map(segment => segment.text).join(' ');

        // Remove all non-alphanumeric characters and replacing them with spaces, but include commas.
        const normalizedText = text.replace(/[^a-zA-Z0-9,]/g, ' ');

        // Remove all extra spaces
        const finalText = normalizedText.trim().replace(/\s+/g, ' ');
        return finalText;
      }
    

};

export { Summarizer };

/*
Open questions:
1) How do we handle the case where the video is too long (defined as bigger than API allows) to summarize?
- We can either return an error
- Return a summary of the first X minutes of the video.
- Split the video into chunks and summarize each chunk, then combine the summaries. (preferred)

2) How do we handle timestamps if we are summarizing the video?
- Not handle them.



*/