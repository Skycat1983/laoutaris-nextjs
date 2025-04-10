import { copy_id, type HasId } from "../../src/lib/helpers/copy_id";

// Mock navigator.clipboard
const mockClipboardWrite = jest.fn(() => Promise.resolve());
Object.defineProperty(global.navigator, "clipboard", {
  value: { writeText: mockClipboardWrite },
  writable: true,
});

describe("copy_id", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console methods
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    // Clear clipboard mock
    mockClipboardWrite.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a function", () => {
    const handler = copy_id();
    expect(typeof handler).toBe("function");
  });

  it("should copy id to clipboard on success", async () => {
    const handler = copy_id();
    const testItem: HasId = { _id: "123456789" };

    await handler(testItem);

    expect(mockClipboardWrite).toHaveBeenCalledWith("123456789");
    expect(consoleLogSpy).toHaveBeenCalledWith("Copied ID:", "123456789");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle clipboard errors", async () => {
    const mockError = new Error("Clipboard error");
    mockClipboardWrite.mockRejectedValueOnce(mockError);

    const handler = copy_id();
    const testItem: HasId = { _id: "test-id" };

    await handler(testItem);

    expect(mockClipboardWrite).toHaveBeenCalledWith("test-id");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to copy:", mockError);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should work with different id values", async () => {
    const handler = copy_id();
    const testCases: HasId[] = [
      { _id: "123" },
      { _id: "abc-def" },
      { _id: "987654321" },
    ];

    for (const testCase of testCases) {
      await handler(testCase);
      expect(mockClipboardWrite).toHaveBeenCalledWith(testCase._id);
      expect(consoleLogSpy).toHaveBeenCalledWith("Copied ID:", testCase._id);
    }
  });
});
