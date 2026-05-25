describe("clientPromise lazy connection", () => {
  const originalMongoUri = process.env.MONGO_URI;
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.MONGO_URI = originalMongoUri;
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("does not instantiate or connect the raw MongoDB client until awaited", async () => {
    const mockConnect = jest.fn().mockResolvedValue({ connected: true });
    const mockMongoClient = jest.fn(() => ({
      connect: mockConnect,
    }));

    process.env.MONGO_URI = "mongodb+srv://example.test/archive";
    process.env.NODE_ENV = "production";

    jest.doMock("mongodb", () => ({
      MongoClient: mockMongoClient,
      ServerApiVersion: { v1: "1" },
    }));

    const { clientPromise } = await import("@/lib/db/clientPromise");

    expect(mockMongoClient).not.toHaveBeenCalled();
    expect(mockConnect).not.toHaveBeenCalled();

    await expect(clientPromise).resolves.toEqual({ connected: true });

    expect(mockMongoClient).toHaveBeenCalledTimes(1);
    expect(mockMongoClient).toHaveBeenCalledWith(
      "mongodb+srv://example.test/archive",
      expect.objectContaining({
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 60000,
      })
    );
    expect(mockConnect).toHaveBeenCalledTimes(1);

    await clientPromise;

    expect(mockMongoClient).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });
});
