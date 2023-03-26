// SourceValidator class is used to validate the source of the video.
class SourceValidator {
  // A function called is_valid that passes the url to validateUrl and returns the result
  isValid(url: string): boolean {
    return this.validateUrl(url);
  }

  // A function that validates if the url is a valid youtube url or not
  // Note: Only accepts youtube urls
  private validateUrl(url: string): boolean {
    if (url == null || url == "" || url == undefined) {
      return false;
    }

    const regex = /^(https?\:\/\/)?(www\.youtube\.com\/watch\?v=)[a-zA-Z0-9_-]{11}$/;
    return regex.test(url);
  }
}

export { SourceValidator };
