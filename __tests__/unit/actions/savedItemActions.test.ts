import { updateUserFavourites } from "@/lib/actions/updateUserFavourites";
import { updateUserWatchlist } from "@/lib/actions/updateUserWatchlist";
import { ArtworkModel, UserModel } from "@/lib/data/models";
import dbConnect from "@/lib/db/mongodb";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  UserModel: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  ArtworkModel: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

type SavedItemState = {
  success: boolean;
  message: string;
  isFavourited?: boolean;
  isWatchlisted?: boolean;
};

type SavedItemActionCase = {
  name: string;
  stateKey: "isFavourited" | "isWatchlisted";
  userListKey: "favourites" | "watchlist";
  artworkListKey: "favourited" | "watcherlist";
  callWithFalseState: (formData: FormData) => Promise<SavedItemState>;
  callWithTrueState: (formData: FormData) => Promise<SavedItemState>;
  addMessage: string;
  removeMessage: string;
  failureMessage: string;
  listPath: string;
  detailPath: string;
  addUserUpdate: Record<string, Record<string, string>>;
  addArtworkUpdate: Record<string, Record<string, string>>;
  removeUserUpdate: Record<string, Record<string, string>>;
  removeArtworkUpdate: Record<string, Record<string, string>>;
};

const mockGetUserIdFromSession =
  getUserIdFromSession as jest.MockedFunction<typeof getUserIdFromSession>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;
const mockUserFindOne = UserModel.findOne as jest.Mock;
const mockArtworkFindOne = ArtworkModel.findOne as jest.Mock;
const mockUserFindByIdAndUpdate = UserModel.findByIdAndUpdate as jest.Mock;
const mockArtworkFindByIdAndUpdate =
  ArtworkModel.findByIdAndUpdate as jest.Mock;

const userId = "507f1f77bcf86cd799439011";
const artworkId = "64f1f77bcf86cd799439022";
const artworkPath = `/artwork/${artworkId}`;

const createFormData = (value?: FormDataEntryValue) => {
  const formData = new FormData();

  if (value !== undefined) {
    formData.set("artworkId", value);
  }

  return formData;
};

const actionCases: SavedItemActionCase[] = [
  {
    name: "favourites",
    stateKey: "isFavourited",
    userListKey: "favourites",
    artworkListKey: "favourited",
    callWithFalseState: (formData) =>
      updateUserFavourites(
        { success: false, message: "", isFavourited: false },
        formData
      ),
    callWithTrueState: (formData) =>
      updateUserFavourites(
        { success: false, message: "", isFavourited: true },
        formData
      ),
    addMessage: "Added to favourites",
    removeMessage: "Removed from favourites",
    failureMessage: "Failed to update favourites/favourited",
    listPath: "/account/favourites",
    detailPath: `/account/favourites/${artworkId}`,
    addUserUpdate: { $addToSet: { favourites: artworkId } },
    addArtworkUpdate: { $addToSet: { favourited: userId } },
    removeUserUpdate: { $pull: { favourites: artworkId } },
    removeArtworkUpdate: { $pull: { favourited: userId } },
  },
  {
    name: "watchlist",
    stateKey: "isWatchlisted",
    userListKey: "watchlist",
    artworkListKey: "watcherlist",
    callWithFalseState: (formData) =>
      updateUserWatchlist(
        { success: false, message: "", isWatchlisted: false },
        formData
      ),
    callWithTrueState: (formData) =>
      updateUserWatchlist(
        { success: false, message: "", isWatchlisted: true },
        formData
      ),
    addMessage: "Added to watchlist",
    removeMessage: "Removed from watchlist",
    failureMessage: "Failed to update watchlist/watcherlist",
    listPath: "/account/watchlist",
    detailPath: `/account/watchlist/${artworkId}`,
    addUserUpdate: { $addToSet: { watchlist: artworkId } },
    addArtworkUpdate: { $addToSet: { watcherlist: userId } },
    removeUserUpdate: { $pull: { watchlist: artworkId } },
    removeArtworkUpdate: { $pull: { watcherlist: userId } },
  },
];

const mockSavedMembership = (
  actionCase: SavedItemActionCase,
  isSaved: boolean
) => {
  mockUserFindOne.mockResolvedValue({
    [actionCase.userListKey]: isSaved ? [artworkId] : [],
  });
  mockArtworkFindOne.mockResolvedValue({
    [actionCase.artworkListKey]: isSaved ? [userId] : [],
  });
  mockUserFindByIdAndUpdate.mockResolvedValue({ _id: userId });
  mockArtworkFindByIdAndUpdate.mockResolvedValue({ _id: artworkId });
};

const expectNoDbOrModelWork = () => {
  expect(mockDbConnect).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();
  expect(mockArtworkFindOne).not.toHaveBeenCalled();
  expect(mockUserFindByIdAndUpdate).not.toHaveBeenCalled();
  expect(mockArtworkFindByIdAndUpdate).not.toHaveBeenCalled();
  expect(mockRevalidatePath).not.toHaveBeenCalled();
};

const expectDbBeforeModelWork = () => {
  const dbCallOrder = mockDbConnect.mock.invocationCallOrder[0];

  expect(dbCallOrder).toBeLessThan(
    mockUserFindOne.mock.invocationCallOrder[0]
  );
  expect(dbCallOrder).toBeLessThan(
    mockArtworkFindOne.mock.invocationCallOrder[0]
  );
  expect(dbCallOrder).toBeLessThan(
    mockUserFindByIdAndUpdate.mock.invocationCallOrder[0]
  );
  expect(dbCallOrder).toBeLessThan(
    mockArtworkFindByIdAndUpdate.mock.invocationCallOrder[0]
  );
};

const expectRevalidatedPaths = (actionCase: SavedItemActionCase) => {
  expect(mockRevalidatePath).toHaveBeenCalledTimes(3);
  expect(mockRevalidatePath).toHaveBeenNthCalledWith(1, actionCase.listPath);
  expect(mockRevalidatePath).toHaveBeenNthCalledWith(2, actionCase.detailPath);
  expect(mockRevalidatePath).toHaveBeenNthCalledWith(3, artworkPath);
};

describe("saved item server actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue(userId);
    mockDbConnect.mockResolvedValue(undefined);
  });

  it.each(actionCases)(
    "returns the stable unauthenticated failure for $name before DB/model work",
    async (actionCase) => {
      mockGetUserIdFromSession.mockResolvedValue(null);

      const result = await actionCase.callWithFalseState(
        createFormData(artworkId)
      );

      expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
      expectNoDbOrModelWork();
      expect(result).toEqual({
        success: false,
        message: "User not logged in",
        [actionCase.stateKey]: false,
      });
    }
  );

  it.each(actionCases)(
    "returns the stable missing-user failure for $name before DB/model work",
    async (actionCase) => {
      mockGetUserIdFromSession.mockResolvedValue("");

      const result = await actionCase.callWithTrueState(
        createFormData(artworkId)
      );

      expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
      expectNoDbOrModelWork();
      expect(result).toEqual({
        success: false,
        message: "User not logged in",
        [actionCase.stateKey]: true,
      });
    }
  );

  it.each(actionCases)(
    "returns the stable missing artworkId failure for $name before session or DB/model work",
    async (actionCase) => {
      const result = await actionCase.callWithFalseState(createFormData());

      expect(mockGetUserIdFromSession).not.toHaveBeenCalled();
      expectNoDbOrModelWork();
      expect(result).toEqual({
        success: false,
        message: "User not logged in",
        [actionCase.stateKey]: false,
      });
    }
  );

  it.each(actionCases)(
    "returns the stable non-string artworkId failure for $name before session or DB/model work",
    async (actionCase) => {
      const result = await actionCase.callWithFalseState(
        createFormData(new File(["not-an-id"], "artwork-id.txt"))
      );

      expect(mockGetUserIdFromSession).not.toHaveBeenCalled();
      expectNoDbOrModelWork();
      expect(result).toEqual({
        success: false,
        message: "User not logged in",
        [actionCase.stateKey]: false,
      });
    }
  );

  it.each(actionCases)(
    "connects before model work, adds $name, and revalidates affected paths",
    async (actionCase) => {
      mockSavedMembership(actionCase, false);

      const result = await actionCase.callWithFalseState(
        createFormData(artworkId)
      );

      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expectDbBeforeModelWork();
      expect(mockUserFindOne).toHaveBeenCalledWith({ _id: userId });
      expect(mockArtworkFindOne).toHaveBeenCalledWith({ _id: artworkId });
      expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        actionCase.addUserUpdate,
        { new: true }
      );
      expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
        artworkId,
        actionCase.addArtworkUpdate,
        { new: true }
      );
      expectRevalidatedPaths(actionCase);
      expect(result).toEqual({
        success: true,
        message: actionCase.addMessage,
        [actionCase.stateKey]: true,
      });
    }
  );

  it.each(actionCases)(
    "connects before model work, removes $name, and revalidates affected paths",
    async (actionCase) => {
      mockSavedMembership(actionCase, true);

      const result = await actionCase.callWithTrueState(
        createFormData(artworkId)
      );

      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expectDbBeforeModelWork();
      expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        actionCase.removeUserUpdate,
        { new: true }
      );
      expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
        artworkId,
        actionCase.removeArtworkUpdate,
        { new: true }
      );
      expectRevalidatedPaths(actionCase);
      expect(result).toEqual({
        success: true,
        message: actionCase.removeMessage,
        [actionCase.stateKey]: false,
      });
    }
  );

  it.each(actionCases)(
    "does not revalidate $name paths when persistence fails",
    async (actionCase) => {
      mockSavedMembership(actionCase, false);
      mockUserFindByIdAndUpdate.mockResolvedValue(null);

      const result = await actionCase.callWithFalseState(
        createFormData(artworkId)
      );

      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        actionCase.addUserUpdate,
        { new: true }
      );
      expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
        artworkId,
        actionCase.addArtworkUpdate,
        { new: true }
      );
      expect(mockRevalidatePath).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: actionCase.failureMessage,
        [actionCase.stateKey]: false,
      });
    }
  );
});
