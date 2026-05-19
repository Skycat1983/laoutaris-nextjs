import {
  CLOUDINARY_DELIVERY_TRANSFORMS,
  getCloudinaryDeliveryUrl,
} from "@/lib/images/cloudinaryDelivery";

const baseUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/artwork/example.jpg";

describe("Cloudinary delivery transforms", () => {
  it.each([
    ["card", CLOUDINARY_DELIVERY_TRANSFORMS.card],
    ["galleryList", CLOUDINARY_DELIVERY_TRANSFORMS.galleryList],
    ["adminPreview", CLOUDINARY_DELIVERY_TRANSFORMS.adminPreview],
    ["blogHero", CLOUDINARY_DELIVERY_TRANSFORMS.blogHero],
    ["blogFeatureHero", CLOUDINARY_DELIVERY_TRANSFORMS.blogFeatureHero],
    ["blogFeatureCard", CLOUDINARY_DELIVERY_TRANSFORMS.blogFeatureCard],
    ["blogGridCard", CLOUDINARY_DELIVERY_TRANSFORMS.blogGridCard],
    ["blogListThumbnail", CLOUDINARY_DELIVERY_TRANSFORMS.blogListThumbnail],
  ] as const)("applies the %s variant", (variant, transform) => {
    expect(getCloudinaryDeliveryUrl(baseUrl, variant)).toBe(
      `https://res.cloudinary.com/dzncmfirr/image/upload/${transform}/v1730000000/artwork/example.jpg`
    );
  });

  it("leaves original URLs unchanged", () => {
    expect(getCloudinaryDeliveryUrl(baseUrl)).toBe(baseUrl);
    expect(getCloudinaryDeliveryUrl(baseUrl, "original")).toBe(baseUrl);
  });

  it("preserves query strings and existing transformation path segments", () => {
    expect(
      getCloudinaryDeliveryUrl(
        "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,g_north/v1730000000/artwork/example.jpg?fresh=true",
        "card"
      )
    ).toBe(
      "https://res.cloudinary.com/dzncmfirr/image/upload/w_300,q_auto/c_crop,g_north/v1730000000/artwork/example.jpg?fresh=true"
    );
  });

  it("does not transform non-Cloudinary, mismatched-cloud, or malformed URLs", () => {
    expect(
      getCloudinaryDeliveryUrl(
        "https://cdn.shopify.com/s/files/1/0000/products/example.jpg",
        "card"
      )
    ).toBe("https://cdn.shopify.com/s/files/1/0000/products/example.jpg");

    expect(
      getCloudinaryDeliveryUrl(
        "https://res.cloudinary.com/other-cloud/image/upload/v1/example.jpg",
        "card"
      )
    ).toBe("https://res.cloudinary.com/other-cloud/image/upload/v1/example.jpg");

    expect(getCloudinaryDeliveryUrl("not-a-url", "card")).toBe("not-a-url");
  });

  it("rejects non-default Cloudinary URL authority details by returning the input", () => {
    expect(
      getCloudinaryDeliveryUrl(
        "https://user:password@res.cloudinary.com/dzncmfirr/image/upload/v1/example.jpg",
        "card"
      )
    ).toBe(
      "https://user:password@res.cloudinary.com/dzncmfirr/image/upload/v1/example.jpg"
    );

    expect(
      getCloudinaryDeliveryUrl(
        "https://res.cloudinary.com:8443/dzncmfirr/image/upload/v1/example.jpg",
        "card"
      )
    ).toBe(
      "https://res.cloudinary.com:8443/dzncmfirr/image/upload/v1/example.jpg"
    );
  });
});
