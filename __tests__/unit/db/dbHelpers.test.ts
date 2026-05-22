import dbConnect from "@/lib/db/mongodb";
import { CustomMongoDBAdapter } from "@/lib/db/adapter";
import { withDbConnect } from "@/lib/db/connectWithRetry";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  "@auth/mongodb-adapter",
  () => ({
    MongoDBAdapter: jest.fn(),
  }),
  { virtual: true }
);

const mockedDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockedMongoDBAdapter = MongoDBAdapter as jest.Mock;

describe("DB helper behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("connects before executing the wrapped handler", async () => {
    const callOrder: string[] = [];
    mockedDbConnect.mockImplementation(async () => {
      callOrder.push("connect");
      return undefined;
    });

    const result = await withDbConnect(async () => {
      callOrder.push("handler");
      return "handled";
    });

    expect(result).toBe("handled");
    expect(callOrder).toEqual(["connect", "handler"]);
  });

  it("rethrows connection failures without calling the wrapped handler", async () => {
    const connectionError = new Error("connection failed");
    const handler = jest.fn();
    mockedDbConnect.mockRejectedValue(connectionError);

    await expect(withDbConnect(handler)).rejects.toBe(connectionError);
    expect(handler).not.toHaveBeenCalled();
  });

  it("adds user defaults before delegating adapter-created users", async () => {
    const createdUser = { id: "user-1", name: "OAuth User" };
    const createUser = jest.fn().mockResolvedValue(createdUser);
    mockedMongoDBAdapter.mockReturnValue({ createUser });

    const adapter = CustomMongoDBAdapter(Promise.resolve({} as never));
    const profile = {
      email: "oauth@example.com",
      image: "https://example.com/avatar.png",
      name: "OAuth User",
    };

    await expect(adapter.createUser(profile)).resolves.toBe(createdUser);
    expect(createUser).toHaveBeenCalledWith({
      ...profile,
      username: profile.name,
      role: "user",
      watchlist: [],
      favourites: [],
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("preserves a null adapter-created user result", async () => {
    mockedMongoDBAdapter.mockReturnValue({
      createUser: jest.fn().mockResolvedValue(null),
    });

    const adapter = CustomMongoDBAdapter(Promise.resolve({} as never));

    await expect(adapter.createUser({ name: "OAuth User" })).resolves.toBeNull();
  });

  it("throws when the base adapter does not implement createUser", async () => {
    mockedMongoDBAdapter.mockReturnValue({});

    const adapter = CustomMongoDBAdapter(Promise.resolve({} as never));

    await expect(adapter.createUser({ name: "OAuth User" })).rejects.toThrow(
      "createUser is not implemented by the base adapter"
    );
  });
});
