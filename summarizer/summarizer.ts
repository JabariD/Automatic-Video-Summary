import { VideoSegment } from '../transcript/youtube/youtube';
import API from "./ai/api"
import { SummarizerOptions } from '../util/interfaces';

// Summarizer 
class Summarizer {
    constructor() {
        // Summarizer must have valid API instance to work.
        this.API_ = new API();
    }
    
    // Public function to summarize the video segments. Returns Error if there is an error in the summarization process.
    async getSummary(videoSegments: VideoSegment[], options: SummarizerOptions): Promise<string> {
        try {
            return this.summarize(videoSegments, options);
        } catch (error) {
            return error;
        }
    }

    // Process to summarize a video.
    private async summarize(videoSegments: VideoSegment[], options: SummarizerOptions) : Promise<string> {
        // Normalizes the video segments.
        const sanitizedText : string = this.normalizeText(videoSegments);
        return await this.API_.summarizeVideo(sanitizedText, options);
    }

    // Returns a normalized (i.e. no special characters, no extra spaces) string of the text in the video segments.
    private normalizeText(videoSegments: VideoSegment[]) : string{
        // Concatenate all the `text` fields of the `textSegments` array into a single string
        const text = videoSegments.map(segment => segment.text).join(' ');

        // Remove all non-alphanumeric characters and replacing them with spaces, but include commas and dashes.
        const normalizedText = text.replace(/[^a-zA-Z0-9',-]/g, ' ');

        // Remove all extra spaces
        const finalText = normalizedText.trim().replace(/\s+/g, ' ');
        return finalText;
      }

    private API_ : API;

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