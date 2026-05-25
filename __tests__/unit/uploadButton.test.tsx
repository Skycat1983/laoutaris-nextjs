import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type {
  CloudinaryUploadWidgetInstanceMethods,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { UploadButton } from "@/components/elements/buttons/UploadButton";

type MockRenderProps = {
  open?: () => void;
  isLoading?: boolean;
  cloudinary: Record<string, never>;
  widget: Record<string, never>;
};

let mockRenderProps: MockRenderProps;

jest.mock("next-cloudinary", () => ({
  CldUploadWidget: jest.fn(
    ({
      children,
    }: {
      children: (renderProps: MockRenderProps) => ReactNode;
    }) => <div data-testid="cloudinary-widget">{children(mockRenderProps)}</div>
  ),
}));

const mockedCldUploadWidget = CldUploadWidget as jest.MockedFunction<
  typeof CldUploadWidget
>;
type UploadWidgetProps = Parameters<typeof CldUploadWidget>[0];
type UploadSuccessWidget = Parameters<
  NonNullable<UploadWidgetProps["onSuccess"]>
>[1];

const createWidgetMethods = (): CloudinaryUploadWidgetInstanceMethods => ({
  close: () => undefined,
  destroy: async () => undefined,
  hide: () => undefined,
  isDestroyed: () => false,
  isMinimized: () => false,
  isShowing: () => false,
  minimize: () => undefined,
  open: () => undefined,
  show: () => undefined,
  update: () => undefined,
});

const createUploadSuccessWidget = (): UploadSuccessWidget => ({
  widget: {},
  ...createWidgetMethods(),
});

describe("UploadButton", () => {
  beforeEach(() => {
    mockRenderProps = {
      open: jest.fn(),
      isLoading: false,
      cloudinary: {},
      widget: {},
    };
    mockedCldUploadWidget.mockClear();
  });

  it("passes the current Cloudinary widget configuration through unchanged", () => {
    render(<UploadButton onUploadSuccess={jest.fn()} />);

    const widgetProps = mockedCldUploadWidget.mock.calls[0][0];
    expect(widgetProps.uploadPreset).toBe("laoutaris_art");
    expect(widgetProps.signatureEndpoint).toBe(
      "/api/v2/admin/sign-cloudinary-params"
    );
    expect(widgetProps.options).toEqual({
      sources: ["local", "google_drive", "dropbox"],
      multiple: false,
      maxFiles: 1,
      maxFileSize: 10000000,
    });
  });

  it("opens the widget from the enabled button", () => {
    render(<UploadButton onUploadSuccess={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Upload an Image" }));

    expect(mockRenderProps.open).toHaveBeenCalledTimes(1);
  });

  it("renders as a non-submit button and supports contextual labels", () => {
    render(
      <form onSubmit={jest.fn()}>
        <UploadButton
          label="Upload replacement image"
          onUploadSuccess={jest.fn()}
        />
      </form>
    );

    const button = screen.getByRole("button", {
      name: "Upload replacement image",
    });
    expect(button).toHaveAttribute("type", "button");
  });

  it("keeps the button disabled while the widget is loading", () => {
    mockRenderProps = {
      ...mockRenderProps,
      isLoading: true,
    };

    render(<UploadButton onUploadSuccess={jest.fn()} />);

    const button = screen.getByRole("button", { name: "Loading..." });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockRenderProps.open).not.toHaveBeenCalled();
  });

  it("forwards successful upload results", () => {
    const onUploadSuccess = jest.fn();
    const result = {
      event: "success",
      info: { secure_url: "https://res.cloudinary.com/demo/image.jpg" },
    } as unknown as CloudinaryUploadWidgetResults;

    render(<UploadButton onUploadSuccess={onUploadSuccess} />);

    const widgetProps = mockedCldUploadWidget.mock.calls[0][0];
    widgetProps.onSuccess?.(result, createUploadSuccessWidget());

    expect(onUploadSuccess).toHaveBeenCalledWith(result);
  });
});
