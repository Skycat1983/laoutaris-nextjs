import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { CreateCollectionForm } from "@/components/features/adminDashboard/crudForms/create/CreateCollectionForm";
import { UpdateCollectionForm } from "@/components/features/adminDashboard/crudForms/update/UpdateCollectionForm";
import { clientApi } from "@/lib/api/clientApi";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
    className?: string;
  }) {
    const React = require("react");
    return React.createElement("img", props);
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    admin: {
      create: {
        collection: jest.fn(),
      },
      update: {
        patchCollection: jest.fn(),
      },
      read: {
        artwork: jest.fn(),
      },
    },
  },
}));

const mockCreateCollection = clientApi.admin.create.collection as jest.Mock;
const mockPatchCollection = clientApi.admin.update.patchCollection as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockRefresh = jest.fn();

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const validCollectionImageUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/collection.jpg";

const collectionId = "507f1f77bcf86cd799439011";
const artworkId = "507f1f77bcf86cd799439012";

const existingCollection = {
  _id: collectionId,
  title: "Archive Collection",
  subtitle: "Selected works",
  summary: "A focused collection summary.",
  text: "Longer collection text for the operator form.",
  imageUrl: validCollectionImageUrl,
  slug: "archive-collection",
  section: "collections",
  artworks: [
    {
      _id: artworkId,
      title: "Archive Work",
      image: {
        secure_url:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000001/artwork.jpg",
      },
    },
  ],
} as never;

const fillCreateCollectionForm = () => {
  fireEvent.change(screen.getByLabelText("Image URL"), {
    target: { value: validCollectionImageUrl },
  });
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Archive Collection" },
  });
  fireEvent.change(screen.getByLabelText("Subtitle"), {
    target: { value: "Selected works" },
  });
  fireEvent.change(screen.getByLabelText("Summary"), {
    target: { value: "A focused collection summary." },
  });
  fireEvent.change(screen.getByLabelText("Content"), {
    target: { value: "Longer collection text for the operator form." },
  });
};

describe("admin collection forms", () => {
  beforeAll(() => {
    global.ResizeObserver = ResizeObserverMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ refresh: mockRefresh });
    mockCreateCollection.mockResolvedValue({ success: true, data: {} });
    mockPatchCollection.mockResolvedValue({ success: true, data: {} });
  });

  it("calls the create success callback after persistence, reset, and refresh", async () => {
    const onSuccess = jest.fn();
    let resolveCreate!: (value: { success: true; data: object }) => void;
    mockCreateCollection.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveCreate = resolve;
      })
    );

    render(<CreateCollectionForm onSuccess={onSuccess} />);
    fillCreateCollectionForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Collection" })
    );

    expect(
      await screen.findByRole("button", { name: "Creating..." })
    ).toBeDisabled();

    resolveCreate({ success: true, data: {} });

    await waitFor(() => {
      expect(mockCreateCollection).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Archive Collection",
          imageUrl: validCollectionImageUrl,
        })
      );
    });
    await waitFor(() => expect(mockRefresh).toHaveBeenCalledTimes(1));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("surfaces create route field validation failures to the operator", async () => {
    const onSuccess = jest.fn();
    mockCreateCollection.mockResolvedValueOnce({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {
        imageUrl: ["Image URL must use an approved content image host"],
      },
      formErrors: [],
    });

    render(<CreateCollectionForm onSuccess={onSuccess} />);
    fillCreateCollectionForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Collection" })
    );

    expect(
      await screen.findByText("Image URL must use an approved content image host")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it("surfaces update route relationship validation failures to the operator", async () => {
    const onSuccess = jest.fn();
    mockPatchCollection.mockResolvedValueOnce({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {
        artworksToAdd: ["One or more artworks were not found"],
      },
      formErrors: [],
    });

    render(
      <UpdateCollectionForm
        collectionInfo={existingCollection}
        onSuccess={onSuccess}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Update Collection" }));

    expect(
      await screen.findByText("One or more artworks were not found")
    ).toBeInTheDocument();
    expect(mockPatchCollection).toHaveBeenCalledWith(
      collectionId,
      expect.objectContaining({
        artworksToAdd: [],
        artworksToRemove: [],
      })
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("surfaces rejected update submissions and restores the loading button", async () => {
    const onSuccess = jest.fn();
    let rejectUpdate!: (error: Error) => void;
    mockPatchCollection.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectUpdate = reject;
      })
    );

    render(
      <UpdateCollectionForm
        collectionInfo={existingCollection}
        onSuccess={onSuccess}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Update Collection" }));

    expect(
      await screen.findByRole("button", { name: "Updating..." })
    ).toBeDisabled();

    rejectUpdate(new Error("Network unavailable"));

    expect(await screen.findByText("Network unavailable")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update Collection" })
    ).not.toBeDisabled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
