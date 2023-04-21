/** Describes settings that can be set by the user to allow for custom behavior. */
export interface SummarizerOptions {
    prompt?: string; // Prompt to use for the summarizer
    custom_api_key?: string; // Custom API key to use for the summarizer
};

/** Similar to absl::Status, returns a status with a custom string. */
export interface CustomError {
    message: string; // Custom error message
    status: number; //  HTTP status code (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
};