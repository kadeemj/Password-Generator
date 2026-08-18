import { describe, expect, it } from "vitest";
import { generatePassphrase } from "./passphrase";
import { WORDLIST } from "./wordlist";

describe("generatePassphrase", () => {
  it("generates the requested number of words from the bundled list", () => {
    const phrase = generatePassphrase(6);
    const words = phrase.split("-");

    expect(words).toHaveLength(6);
    expect(words.every((word) => WORDLIST.includes(word))).toBe(true);
  });

  it("rejects an invalid word count", () => {
    expect(() => generatePassphrase(0)).toThrow(
      "Word count must be at least 1",
    );
  });

  it("contains the expected EFF list size", () => {
    expect(WORDLIST).toHaveLength(7776);
    expect(WORDLIST.every((word) => word.length > 0)).toBe(true);
  });
});
