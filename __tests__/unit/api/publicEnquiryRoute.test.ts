import { POST } from "@/app/api/v2/public/enquiry/route";
import dbConnect from "@/lib/db/mongodb";
import { EnquiryModel } from "@/lib/data/models/enquiryModel";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/enquiryModel", () => ({
  EnquiryModel: {
    create: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCreate = EnquiryModel.create as jest.Mock;

const createRequest = (body: unknown) =>
  ({
    json: jest.fn().mockResolvedValue(body),
  } as never);

const createInvalidJsonRequest = () =>
  ({
    json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
  } as never);

const validPayload = {
  name: "Ada Buyer",
  email: "ada@example.com",
  subject: "Product enquiry",
  message: "Please send purchase details.",
};

describe("POST /api/v2/public/enquiry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockCreate.mockResolvedValue({ _id: "enquiry-id" });
  });

  it("returns 400 for invalid email and does not write to MongoDB", async () => {
    const response = await POST(
      createRequest({
        ...validPayload,
        email: "not-an-email",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid enquiry input",
      fieldErrors: {
        email: ["Please enter a valid email address."],
      },
      formErrors: [],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for missing or short required fields", async () => {
    const response = await POST(
      createRequest({
        name: " A ",
        email: "ada@example.com",
        subject: " x ",
        message: " too few ",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid enquiry input",
      fieldErrors: {
        name: ["Name must be at least 2 characters."],
        subject: ["Subject must be at least 2 characters."],
        message: ["Message must be at least 10 characters."],
      },
      formErrors: [],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not write to MongoDB", async () => {
    const response = await POST(createInvalidJsonRequest());
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid enquiry input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("persists only the normalized enquiry DTO for valid input", async () => {
    const response = await POST(
      createRequest({
        name: "  Ada Buyer  ",
        email: "  ADA@EXAMPLE.COM  ",
        subject: "  Product enquiry  ",
        message: "  Please send purchase details.  ",
        role: "admin",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(validPayload);
    expect(body).toEqual({
      success: true,
      message: "Enquiry received",
      data: {
        success: true,
        message: "Enquiry received",
      },
    });
  });

  it("returns a public-safe 500 when persistence fails", async () => {
    mockCreate.mockRejectedValue(new Error("private database detail"));

    const response = await POST(createRequest(validPayload));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(validPayload);
    expect(body).toEqual({
      success: false,
      error: "Enquiry could not be created",
    });
  });
});
