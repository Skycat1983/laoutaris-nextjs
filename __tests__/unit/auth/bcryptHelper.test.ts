import { encryptPassword, verifyPassword } from "@/lib/helpers/bcrypt";

const PASSWORD = "p@5sw0rd";
const WRONG_PASSWORD = "not-the-password";
const BCRYPT_5_HASH_FIXTURE =
  "$2b$12$zQ4CooEXdGqcwi0PHsgc8eAf0DLXE/XHoBE8kCSGQ97rXwuClaPam";

describe("bcrypt helper", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("creates a bcrypt 6 hash and verifies it", async () => {
    const hashedPassword = await encryptPassword(PASSWORD);

    expect(hashedPassword).not.toBe(PASSWORD);
    expect(hashedPassword).toHaveLength(60);
    expect(hashedPassword).toMatch(/^\$2b\$10\$/);

    await expect(verifyPassword(PASSWORD, hashedPassword)).resolves.toBe(true);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("verifies an existing bcrypt 5 hash fixture", async () => {
    await expect(
      verifyPassword(PASSWORD, BCRYPT_5_HASH_FIXTURE)
    ).resolves.toBe(true);

    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("rejects incorrect passwords", async () => {
    await expect(
      verifyPassword(WRONG_PASSWORD, BCRYPT_5_HASH_FIXTURE)
    ).resolves.toBe(false);
  });

  it("rejects malformed hashes without throwing", async () => {
    await expect(verifyPassword(PASSWORD, "not-a-bcrypt-hash")).resolves.toBe(
      false
    );
  });
});
