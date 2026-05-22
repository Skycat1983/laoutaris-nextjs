import {
  submitSubscription,
  unsubscribeNewsletter,
} from "@/lib/actions/submitSubscription";
import { SubscriberModel } from "@/lib/data/models/subscribersModel";
import {
  NEWSLETTER_CONSENT_FIELD_VALUE,
  NEWSLETTER_CONSENT_TEXT,
  NEWSLETTER_CONSENT_TEXT_SOURCE,
  NEWSLETTER_CONSENT_VERSION,
} from "@/lib/data/schemas/subscriberSchema";
import dbConnect from "@/lib/db/mongodb";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/subscribersModel", () => ({
  SubscriberModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockFindOne = SubscriberModel.findOne as jest.Mock;
const mockCreate = SubscriberModel.create as jest.Mock;
const mockFindOneAndUpdate = SubscriberModel.findOneAndUpdate as jest.Mock;

const initialState = {
  success: false,
  message: "",
};

const createFormData = (
  email?: FormDataEntryValue,
  options: {
    consent?: boolean;
    sourcePath?: FormDataEntryValue;
  } = {}
) => {
  const formData = new FormData();
  const { consent = true, sourcePath = "/artwork" } = options;

  if (email !== undefined) {
    formData.set("email", email);
  }

  if (consent) {
    formData.set("newsletterConsent", NEWSLETTER_CONSENT_FIELD_VALUE);
  }

  if (sourcePath !== undefined) {
    formData.set("sourcePath", sourcePath);
  }

  return formData;
};

const createUnsubscribeFormData = (token?: FormDataEntryValue) => {
  const formData = new FormData();

  if (token !== undefined) {
    formData.set("token", token);
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
        unsubscribedAt: null,
        consentVersion: NEWSLETTER_CONSENT_VERSION,
        consentText: NEWSLETTER_CONSENT_TEXT,
        consentTextSource: NEWSLETTER_CONSENT_TEXT_SOURCE,
        consentAcceptedAt: new Date("2026-05-22T12:00:00.000Z"),
        sourcePath: "/artwork",
        unsubscribeToken: "safe-generated-placeholder-1234567890",
      }),
    });
    mockFindOneAndUpdate.mockResolvedValue({
      _id: "subscriber-id",
      unsubscribed: true,
      unsubscribedAt: new Date("2026-05-22T12:00:00.000Z"),
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

  it("returns a stable validation failure when newsletter consent is missing", async () => {
    const result = await submitSubscription(
      initialState,
      createFormData("ada@example.com", { consent: false })
    );

    expect(result).toEqual({
      success: false,
      message: "Please confirm newsletter consent before subscribing.",
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

  it("connects, duplicate-checks, and persists normalized email with consent metadata for valid input", async () => {
    const result = await submitSubscription(
      initialState,
      createFormData("  ADA@EXAMPLE.COM  ")
    );

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ email: "ada@example.com" });
    expect(mockCreate).toHaveBeenCalledWith({
      email: "ada@example.com",
      unsubscribed: false,
      unsubscribedAt: null,
      consentVersion: NEWSLETTER_CONSENT_VERSION,
      consentText: NEWSLETTER_CONSENT_TEXT,
      consentTextSource: NEWSLETTER_CONSENT_TEXT_SOURCE,
      consentAcceptedAt: expect.any(Date),
      sourcePath: "/artwork",
      unsubscribeToken: expect.stringMatching(/^[A-Za-z0-9_-]{32,128}$/),
    });
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
    expect(JSON.stringify(result)).not.toContain("safe-generated-placeholder");
    expect(JSON.stringify(result)).not.toContain(
      NEWSLETTER_CONSENT_TEXT_SOURCE
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("normalizes unsafe subscription source paths before persistence", async () => {
    await submitSubscription(
      initialState,
      createFormData("ada@example.com", {
        sourcePath: "/project/contact?email=private@example.com",
      })
    );

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        sourcePath: "/",
      })
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(
      "private@example.com"
    );
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
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ email: "private@example.com" })
    );
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

describe("unsubscribeNewsletter", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockFindOneAndUpdate.mockResolvedValue({
      _id: "subscriber-id",
      unsubscribed: true,
      unsubscribedAt: new Date("2026-05-22T12:00:00.000Z"),
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

  it("marks the matching subscriber unsubscribed for a valid public identifier", async () => {
    const result = await unsubscribeNewsletter(
      initialState,
      createUnsubscribeFormData("safe-token-placeholder-123456789012345")
    );

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { unsubscribeToken: "safe-token-placeholder-123456789012345" },
      {
        $set: {
          unsubscribed: true,
          unsubscribedAt: expect.any(Date),
        },
      },
      { new: true }
    );
    expect(result).toEqual({
      success: true,
      message: "You have been unsubscribed.",
    });
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("rejects invalid unsubscribe input without querying MongoDB", async () => {
    const result = await unsubscribeNewsletter(
      initialState,
      createUnsubscribeFormData("not valid")
    );

    expect(result).toEqual({
      success: false,
      message: "This unsubscribe link is invalid or has expired.",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindOneAndUpdate).not.toHaveBeenCalled();
  });

  it("returns public-safe output when the public identifier is unknown", async () => {
    mockFindOneAndUpdate.mockResolvedValue(null);

    const result = await unsubscribeNewsletter(
      initialState,
      createUnsubscribeFormData("safe-token-placeholder-123456789012345")
    );

    expect(result).toEqual({
      success: false,
      message: "This unsubscribe link is invalid or has expired.",
    });
    expect(JSON.stringify(result)).not.toContain(
      "safe-token-placeholder-123456789012345"
    );
  });

  it("redacts private unsubscribe data from persistence failure logs", async () => {
    mockFindOneAndUpdate.mockRejectedValue(
      new Error("unsubscribe failed for safe-token-placeholder-123456789012345")
    );

    const result = await unsubscribeNewsletter(
      initialState,
      createUnsubscribeFormData("safe-token-placeholder-123456789012345")
    );

    expect(result).toEqual({
      success: false,
      message: "We could not complete your unsubscribe request. Please try again.",
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(logPayload).toEqual(
      expect.objectContaining({
        level: "error",
        event: "action.subscription.unsubscribe.failed",
        operation: "subscription.unsubscribe",
        surface: "server_action",
        action: "unsubscribeNewsletter",
        statusCategory: "persistence_failed",
        error: {
          name: "Error",
          message: "Subscription unsubscribe failed",
        },
      })
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(
      "safe-token-placeholder-123456789012345"
    );
  });
});
