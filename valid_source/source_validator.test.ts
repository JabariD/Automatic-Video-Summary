import SourceValidator from "./source_validator";

describe("SourceValidator", () => {
  it("should return true for valid youtube url", () => {
    const sourceValidator = new SourceValidator();
    expect(
      sourceValidator.isValid("https://www.youtube.com/watch?v=9bZkp7q19f0")
    ).toBe(true);
  });

  it("should return false if website is not youtube", () => {
    const sourceValidator = new SourceValidator();
    expect(sourceValidator.isValid("https://www.google.com")).toBe(false);
  });

  it("should return false for youtube channel url", () => {
    const sourceValidator = new SourceValidator();
    expect(
      sourceValidator.isValid(
        "https://www.youtube.com/channel/UCt8qXopnhaFQKACpesQ0NWA"
      )
    ).toBe(false);
  });

  it("should return false for youtube playlist url", () => {
    const sourceValidator = new SourceValidator();
    expect(
      sourceValidator.isValid(
        "https://www.youtube.com/playlist?list=PLH0Szn1yYNed-qNJ-Isr2XdPCj29ZPJnS"
      )
    ).toBe(false);
  });
});
