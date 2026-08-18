import { describe, expect, it } from "vitest";
import {
  buildCharset,
  generatePassword,
  randomIndex,
  type CharsetOptions,
} from "./generate";

const allCharsets: CharsetOptions = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

describe("randomIndex", () => {
  it("returns an index within the requested range", () => {
    for (let i = 0; i < 100; i++) {
      const index = randomIndex(7);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(7);
    }
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 0x1_0000_0001])(
    "rejects invalid bounds: %s",
    (max) => {
      expect(() => randomIndex(max)).toThrow();
    },
  );
});

describe("generatePassword", () => {
  it("generates the requested length and includes every enabled category", () => {
    const password = generatePassword(32, allCharsets);

    expect(password).toHaveLength(32);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/);
  });

  it("never includes ambiguous characters when excluded", () => {
    const password = generatePassword(64, {
      ...allCharsets,
      excludeAmbiguous: true,
    });

    expect(password).not.toMatch(/[0OI l1]/);
  });

  it("uses an empty charset only as an error condition", () => {
    expect(
      buildCharset({
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      }),
    ).toBe("");
    expect(() =>
      generatePassword(16, {
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      }),
    ).toThrow("Select at least one character set");
  });
});
