import { submitSubscription } from "@/lib/actions/submitSubscription";
import { SubscriberModel } from "@/lib/data/models/subscribersModel";
import dbConnect from "@/lib/db/mongodb";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/subscribersModel", () => ({
  SubscriberModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockFindOne = SubscriberModel.findOne as jest.Mock;
const mockCreate = SubscriberModel.create as jest.Mock;

const initialState = {
  success: false,
  message: "",
};

const createFormData = (email?: FormDataEntryValue) => {
  const formData = new FormData();

  if (email !== undefined) {
    formData.set("email", email);
  }

  return formData;
};

describe("submitSubscription", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      toObject: () => ({
        _id: { toString: () => "subscriber-id" },
        email: "ada@example.com",
        unsubscribed: false,
      }),
    });
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("returns a stable validation failure for missing email without querying MongoDB", async () => {
    const result = await submitSubscription(initialState, createFormData());

    expect(result).toEqual({
      success: false,
      message: "Please enter a valid email address.",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns a stable validation failure for invalid email without querying MongoDB", async () => {
    const result = await submitSubscription(
      initialState,
      createFormData("not-an-email")
    );

    expect(result).toEqual({
      success: false,
      message: "Please enter a valid email address.",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns a stable validation failure for non-string email form data", async () => {
    const result = await submitSubscription(
      initialState,
      createFormData(new File(["ada@example.com"], "email.txt"))
    );

    expect(result).toEqual({
      success: false,
      message: "Please enter a valid email address.",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("connects, duplicate-checks, and persists normalized email for valid input", async () => {
    const result = await submitSubscription(
      initialState,
      createFormData("  ADA@EXAMPLE.COM  ")
    );

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ email: "ada@example.com" });
    expect(mockCreate).toHaveBeenCalledWith({ email: "ada@example.com" });
    expect(
      mockDbConnect.mock.invocationCallOrder[0]
    ).toBeLessThan(mockFindOne.mock.invocationCallOrder[0]);
    expect(result).toEqual({
      success: true,
      message: "Successfully subscribed!",
      data: {
        id: "subscriber-id",
        email: "ada@example.com",
        unsubscribed: false,
      },
    });
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("returns a stable duplicate message and does not create a subscriber", async () => {
    mockFindOne.mockResolvedValue({
      _id: "existing-subscriber-id",
      email: "ada@example.com",
    });

    const result = await submitSubscription(
      initialState,
      createFormData("ADA@EXAMPLE.COM")
    );

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ email: "ada@example.com" });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "You are already subscribed.",
    });
  });

  it("returns a public-safe failure message when persistence fails", async () => {
    mockCreate.mockRejectedValue(
      new Error("duplicate key error for private@example.com")
    );

    const result = await submitSubscription(
      initialState,
      createFormData("private@example.com")
    );

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ email: "private@example.com" });
    expect(mockCreate).toHaveBeenCalledWith({ email: "private@example.com" });
    expect(result).toEqual({
      success: false,
      message: "We could not complete your subscription. Please try again.",
    });
    expect(result.message).not.toContain("duplicate key");
    expect(result.message).not.toContain("private@example.com");
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(logPayload).toEqual(
      expect.objectContaining({
        level: "error",
        event: "action.subscription.submit.failed",
        operation: "subscription.submit",
        surface: "server_action",
        action: "submitSubscription",
        statusCategory: "persistence_failed",
        error: {
          name: "Error",
          message: "Subscription action failed",
        },
      })
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(
      "private@example.com"
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(
      "duplicate key"
    );
  });

  it("does not directly log subscription input", async () => {
    await submitSubscription(
      initialState,
      createFormData("  ADA@EXAMPLE.COM  ")
    );

    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(
      "ada@example.com"
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(
      "ADA@EXAMPLE.COM"
    );
  });
});
