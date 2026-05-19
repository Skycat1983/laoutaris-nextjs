import {
  buildContentImageUrlSchema,
  CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR,
  isAllowedContentImageUrl,
} from "@/lib/validation/contentImageUrl";

const schema = buildContentImageUrlSchema({
  requiredError: "Image URL is required",
  invalidTypeError: "Image URL must be a string",
  invalidUrlError: "Must be a valid URL",
  maxLength: 2048,
  maxLengthError: "Image URL must be 2048 characters or fewer",
});

describe("content image URL validation", () => {
  it("accepts the configured Cloudinary delivery path", () => {
    expect(
      isAllowedContentImageUrl(
        "https://res.cloudinary.com/dzncmfirr/image/upload/w_800,q_auto/v1730000000/blog.jpg?fresh=true"
      )
    ).toBe(true);
  });

  it("accepts explicitly allowed external image hosts", () => {
    expect(
      isAllowedContentImageUrl(
        "https://cdn-icons-png.flaticon.com/512/1000/1000000.png"
      )
    ).toBe(true);
    expect(
      isAllowedContentImageUrl(
        "https://cdn.shopify.com/s/files/1/0000/0001/products/product.jpg?v=1"
      )
    ).toBe(true);
  });

  it("rejects arbitrary hosts and mismatched Cloudinary clouds", () => {
    expect(isAllowedContentImageUrl("https://example.com/blog.jpg")).toBe(
      false
    );
    expect(
      isAllowedContentImageUrl(
        "https://res.cloudinary.com/other-cloud/image/upload/blog.jpg"
      )
    ).toBe(false);
  });

  it("rejects malformed URLs, unsupported protocols, credentials, and ports", () => {
    expect(isAllowedContentImageUrl("not-a-url")).toBe(false);
    expect(
      isAllowedContentImageUrl(
        "http://res.cloudinary.com/dzncmfirr/image/upload/blog.jpg"
      )
    ).toBe(false);
    expect(
      isAllowedContentImageUrl(
        "https://user:password@res.cloudinary.com/dzncmfirr/image/upload/blog.jpg"
      )
    ).toBe(false);
    expect(
      isAllowedContentImageUrl(
        "https://res.cloudinary.com:8443/dzncmfirr/image/upload/blog.jpg"
      )
    ).toBe(false);
  });

  it("keeps malformed URL errors separate from unsupported host errors", () => {
    expect(schema.safeParse("not-a-url").error?.flatten()).toEqual({
      fieldErrors: {},
      formErrors: ["Must be a valid URL"],
    });

    expect(
      schema.safeParse("https://example.com/blog.jpg").error?.flatten()
    ).toEqual({
      fieldErrors: {},
      formErrors: [CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR],
    });
  });
});
