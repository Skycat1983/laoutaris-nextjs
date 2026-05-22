import { processRegistration } from "@/lib/actions/processRegistration";
import { registerUser } from "@/lib/actions/registerUser";
import dbConnect from "@/lib/db/mongodb";
import {
  ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_NAME,
  ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_VALUE,
  ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_REQUIRED_MESSAGE,
  ACCOUNT_PRIVACY_VERSION,
  ACCOUNT_TERMS_VERSION,
} from "@/lib/constants";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/actions/registerUser", () => ({
  registerUser: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;

const initialState = {
  type: "validation" as const,
  formValidationErrors: {},
};

const createRegistrationFormData = (options: {
  acknowledge?: boolean;
  email?: string;
  password?: string;
  username?: string;
} = {}) => {
  const {
    acknowledge = true,
    email = "ada@example.com",
    password = "password1",
    username = "member1",
  } = options;
  const formData = new FormData();

  formData.set("email", email);
  formData.set("password", password);
  formData.set("username", username);

  if (acknowledge) {
    formData.set(
      ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_NAME,
      ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_VALUE
    );
  }

  return formData;
};

describe("processRegistration account privacy acknowledgement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockRegisterUser.mockResolvedValue({
      success: true,
      message: "User created successfully",
      user: {
        _id: "user-id",
        email: "ada@example.com",
        username: "member1",
      },
    });
  });

  it("requires privacy and terms acknowledgement before registering credentials users", async () => {
    const result = await processRegistration(
      initialState,
      createRegistrationFormData({ acknowledge: false })
    );

    expect(result).toEqual({
      type: "validation",
      formValidationErrors: {
        accountPrivacyAcknowledged:
          ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_REQUIRED_MESSAGE,
      },
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it("passes owner-approved acknowledgement metadata to credentials registration", async () => {
    const result = await processRegistration(
      initialState,
      createRegistrationFormData()
    );

    expect(mockRegisterUser).toHaveBeenCalledWith({
      email: "ada@example.com",
      username: "member1",
      password: "password1",
      accountPrivacyAcknowledgement: {
        privacyVersion: ACCOUNT_PRIVACY_VERSION,
        termsVersion: ACCOUNT_TERMS_VERSION,
        acceptedAt: expect.any(Date),
        acceptedBy: "credentials",
        provider: "credentials",
        sourceSurface: "credentials-signup",
      },
    });
    expect(result).toEqual({
      type: "success",
      user: {
        _id: "user-id",
        email: "ada@example.com",
        username: "member1",
      },
    });
  });
});
