import { registerUser } from "@/lib/actions/registerUser";
import { UserModel } from "@/lib/data/models";
import { encryptPassword } from "@/lib/helpers/bcrypt";
import { createAccountPrivacyAcknowledgement } from "@/lib/constants";

jest.mock("@/lib/data/models", () => ({
  UserModel: jest.fn(),
}));

jest.mock("@/lib/helpers/bcrypt", () => ({
  encryptPassword: jest.fn(),
}));

const mockUserModel = UserModel as unknown as jest.Mock;
const mockEncryptPassword = encryptPassword as jest.MockedFunction<
  typeof encryptPassword
>;

describe("registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEncryptPassword.mockResolvedValue("hashed-password");
  });

  it("persists credentials users with privacy and terms acknowledgement metadata", async () => {
    const accountPrivacyAcknowledgement = createAccountPrivacyAcknowledgement({
      acceptedBy: "credentials",
      provider: "credentials",
      sourceSurface: "credentials-signup",
    });
    const save = jest.fn().mockResolvedValue({
      _id: "user-id",
      email: "ada@example.com",
      username: "member1",
    });

    mockUserModel.mockImplementation(() => ({ save }));

    const result = await registerUser({
      email: "ada@example.com",
      username: "member1",
      password: "password1",
      accountPrivacyAcknowledgement,
    });

    expect(mockEncryptPassword).toHaveBeenCalledWith("password1");
    expect(mockUserModel).toHaveBeenCalledWith({
      email: "ada@example.com",
      username: "member1",
      password: "hashed-password",
      accountPrivacyAcknowledgement,
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      message: "User created successfully",
      user: {
        _id: "user-id",
        email: "ada@example.com",
        username: "member1",
      },
    });
  });
});
