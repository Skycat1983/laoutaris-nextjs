import {
  ArticleModel,
  ArtworkModel,
  BlogModel,
  CollectionModel,
  CommentModel,
  UserModel,
} from "@/lib/data/models";
import type {
  AdminDeletePreview,
  AdminDeletePreviewAction,
  AdminDeletePreviewBlocker,
  AdminDeletePreviewImpact,
  AdminDeletePreviewMetadataValue,
  AdminDeletePreviewRecord,
  AdminDeletePreviewRecordResource,
  AdminDeleteProductionEvidenceReminder,
  AdminDeleteResource,
} from "./previewTypes";

export type {
  AdminDeletePreview,
  AdminDeletePreviewAction,
  AdminDeletePreviewBlocker,
  AdminDeletePreviewImpact,
  AdminDeletePreviewMetadataValue,
  AdminDeletePreviewRecord,
  AdminDeletePreviewRecordResource,
  AdminDeleteProductionEvidenceReminder,
  AdminDeleteResource,
} from "./previewTypes";

type PreviewDocument = {
  _id?: unknown;
  id?: unknown;
  title?: unknown;
  slug?: unknown;
  username?: unknown;
  role?: unknown;
  artwork?: unknown;
  author?: unknown;
  blog?: unknown;
  comments?: unknown;
  watchlist?: unknown;
  favourites?: unknown;
  artworks?: unknown;
  image?: unknown;
  imageUrl?: unknown;
};

type CloudinaryImageLike = {
  public_id?: unknown;
  secure_url?: unknown;
  bytes?: unknown;
  format?: unknown;
};

const productionEvidenceReminders =
  (): AdminDeleteProductionEvidenceReminder[] => [
    {
      code: "mongodb_backup",
      label: "MongoDB backup/export evidence",
      required: true,
      description:
        "Confirm a current MongoDB backup or export exists before running destructive production deletes.",
    },
    {
      code: "owner_review",
      label: "Owner or delegated review evidence",
      required: true,
      description:
        "Confirm owner-approved or delegated review evidence before running destructive production deletes.",
    },
    {
      code: "redacted_audit_event",
      label: "Redacted audit-event evidence",
      required: true,
      description:
        "Record a redacted audit event with actor, resource, cascade summary, and request evidence for production deletes.",
    },
  ];

const toStringValue = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const toString = (value as { toString?: () => string }).toString;
    if (typeof toString === "function") {
      const stringValue = toString.call(value);
      return stringValue === "[object Object]" ? null : stringValue;
    }
  }

  return null;
};

const toDocument = (value: unknown): PreviewDocument | null =>
  value && typeof value === "object" ? (value as PreviewDocument) : null;

const toDocuments = (value: unknown): PreviewDocument[] =>
  Array.isArray(value)
    ? value.flatMap((item) => {
        const document = toDocument(item);
        return document ? [document] : [];
      })
    : [];

const documentId = (document: PreviewDocument, fallbackId?: string) =>
  toStringValue(document._id) ?? toStringValue(document.id) ?? fallbackId ?? "";

const fieldIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.flatMap((item) => {
        const id = toStringValue(item);
        return id ? [id] : [];
      })
    : [];

const unique = (values: string[]) => Array.from(new Set(values));

const stringMetadata = (
  key: string,
  value: unknown
): Record<string, AdminDeletePreviewMetadataValue> => {
  const stringValue = toStringValue(value);
  return stringValue ? { [key]: stringValue } : {};
};

const record = (
  resource: AdminDeletePreviewRecordResource,
  id: string,
  label: string | null = null,
  metadata?: Record<string, AdminDeletePreviewMetadataValue>
): AdminDeletePreviewRecord => ({
  resource,
  id,
  label,
  ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {}),
});

const targetRecord = (
  resource: AdminDeleteResource,
  document: PreviewDocument,
  fallbackId: string
) =>
  record(
    resource,
    documentId(document, fallbackId),
    toStringValue(document.title) ?? toStringValue(document.username),
    {
      ...stringMetadata("slug", document.slug),
      ...stringMetadata("role", document.role),
    }
  );

const recordsFromIds = (
  resource: AdminDeletePreviewRecordResource,
  ids: string[],
  metadata?: Record<string, AdminDeletePreviewMetadataValue>
) => ids.map((id) => record(resource, id, null, metadata));

const recordsFromDocuments = (
  resource: AdminDeletePreviewRecordResource,
  documents: PreviewDocument[],
  metadata?: Record<string, AdminDeletePreviewMetadataValue>
) =>
  documents.map((document) =>
    record(
      resource,
      documentId(document),
      toStringValue(document.title) ?? toStringValue(document.username),
      {
        ...metadata,
        ...stringMetadata("slug", document.slug),
        ...stringMetadata("role", document.role),
      }
    )
  );

const impact = (
  action: AdminDeletePreviewAction,
  resource: AdminDeletePreviewRecordResource,
  records: AdminDeletePreviewRecord[],
  description: string
): AdminDeletePreviewImpact => ({
  action,
  resource,
  count: records.length,
  records,
  description,
});

const preview = (
  resourceName: AdminDeleteResource,
  target: AdminDeletePreviewRecord,
  blockingConditions: AdminDeletePreviewBlocker[],
  wouldDelete: AdminDeletePreviewImpact[],
  wouldDetachOrUpdate: AdminDeletePreviewImpact[],
  preserved: AdminDeletePreviewImpact[]
): AdminDeletePreview => ({
  resource: resourceName,
  target,
  blocked: blockingConditions.length > 0,
  blockingConditions,
  wouldDelete,
  wouldDetachOrUpdate,
  preserved,
  productionEvidenceReminders: productionEvidenceReminders(),
});

const isCloudinaryUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.hostname.includes("cloudinary.com");
  } catch {
    return false;
  }
};

const cloudinaryImageRecord = (
  value: unknown,
  sourceField: string
): AdminDeletePreviewRecord | null => {
  const image = toDocument(value) as CloudinaryImageLike | null;
  if (!image) {
    return null;
  }

  const publicId = toStringValue(image.public_id);
  const secureUrl = toStringValue(image.secure_url);

  if (!publicId && !secureUrl) {
    return null;
  }

  return record("cloudinaryAsset", publicId ?? secureUrl ?? "", secureUrl, {
    sourceField,
    ...stringMetadata("publicId", publicId),
    ...stringMetadata("format", image.format),
    ...(typeof image.bytes === "number" ? { bytes: image.bytes } : {}),
  });
};

const cloudinaryUrlRecord = (
  value: unknown,
  sourceField: string
): AdminDeletePreviewRecord | null => {
  const url = toStringValue(value);
  if (!url || !isCloudinaryUrl(url)) {
    return null;
  }

  return record("cloudinaryAsset", url, url, {
    sourceField,
  });
};

const compactRecords = (
  records: Array<AdminDeletePreviewRecord | null>
): AdminDeletePreviewRecord[] =>
  records.flatMap((item) => (item === null ? [] : [item]));

export const getArticleDeletePreview = async (
  id: string
): Promise<AdminDeletePreview | null> => {
  const article = toDocument(await ArticleModel.findById(id));
  if (!article) {
    return null;
  }

  const target = targetRecord("article", article, id);
  const preservedAssets = compactRecords([
    cloudinaryUrlRecord(article.imageUrl, "imageUrl"),
  ]);

  return preview(
    "article",
    target,
    [],
    [
      impact("delete", "article", [target], "Delete the target article record."),
    ],
    [],
    preservedAssets.length > 0
      ? [
          impact(
            "preserve",
            "cloudinaryAsset",
            preservedAssets,
            "Current article deletion preserves referenced Cloudinary assets."
          ),
        ]
      : []
  );
};

export const getArtworkDeletePreview = async (
  id: string
): Promise<AdminDeletePreview | null> => {
  const [artwork, referencingArticles, collections, referencingUsers] =
    await Promise.all([
      ArtworkModel.findById(id),
      ArticleModel.find({ artwork: id }),
      CollectionModel.find({ artworks: id }),
      UserModel.find({
        $or: [{ watchlist: id }, { favourites: id }],
      }),
    ]);
  const artworkDocument = toDocument(artwork);
  if (!artworkDocument) {
    return null;
  }

  const target = targetRecord("artwork", artworkDocument, id);
  const articleRecords = recordsFromDocuments(
    "article",
    toDocuments(referencingArticles),
    { relation: "artwork" }
  );
  const blockingConditions: AdminDeletePreviewBlocker[] =
    articleRecords.length > 0
      ? [
          {
            code: "artwork_referenced_by_article",
            message:
              "Artwork deletion is blocked because one or more articles reference this artwork.",
            severity: "blocking",
            records: articleRecords,
          },
        ]
      : [];
  const collectionRecords = recordsFromDocuments(
    "collection",
    toDocuments(collections),
    { field: "artworks" }
  );
  const userRecords = recordsFromDocuments("user", toDocuments(referencingUsers));
  const preservedAssets = compactRecords([
    cloudinaryImageRecord(artworkDocument.image, "image"),
  ]);

  return preview(
    "artwork",
    target,
    blockingConditions,
    [
      impact("delete", "artwork", [target], "Delete the target artwork record."),
    ],
    [
      ...(collectionRecords.length > 0
        ? [
            impact(
              "detach",
              "collection",
              collectionRecords,
              "Pull the artwork ID from matching collection artworks arrays."
            ),
          ]
        : []),
      ...(userRecords.length > 0
        ? [
            impact(
              "update",
              "user",
              userRecords,
              "Pull the artwork ID from affected user favourites and watchlist arrays."
            ),
          ]
        : []),
    ],
    [
      ...(preservedAssets.length > 0
        ? [
            impact(
              "preserve",
              "cloudinaryAsset",
              preservedAssets,
              "Current artwork deletion preserves the Cloudinary image asset."
            ),
          ]
        : []),
    ]
  );
};

export const getBlogDeletePreview = async (
  id: string
): Promise<AdminDeletePreview | null> => {
  const blog = toDocument(await BlogModel.findById(id));
  if (!blog) {
    return null;
  }

  const commentIds = fieldIds(blog.comments);
  const comments = toDocuments(
    commentIds.length > 0
      ? await CommentModel.find({ _id: { $in: commentIds } })
      : []
  );
  const userIds = unique(
    comments.flatMap((comment) => {
      const authorId = toStringValue(comment.author);
      return authorId ? [authorId] : [];
    })
  );
  const target = targetRecord("blog", blog, id);
  const commentRecords = recordsFromDocuments("comment", comments);
  const preservedAssets = compactRecords([
    cloudinaryUrlRecord(blog.imageUrl, "imageUrl"),
  ]);

  return preview(
    "blog",
    target,
    [],
    [
      impact("delete", "blog", [target], "Delete the target blog record."),
      ...(commentRecords.length > 0
        ? [
            impact(
              "delete",
              "comment",
              commentRecords,
              "Delete comments referenced by the target blog."
            ),
          ]
        : []),
    ],
    userIds.length > 0
      ? [
          impact(
            "update",
            "user",
            recordsFromIds("user", userIds, { field: "comments" }),
            "Pull deleted blog comment IDs from affected user comments arrays."
          ),
        ]
      : [],
    preservedAssets.length > 0
      ? [
          impact(
            "preserve",
            "cloudinaryAsset",
            preservedAssets,
            "Current blog deletion preserves referenced Cloudinary assets."
          ),
        ]
      : []
  );
};

export const getCollectionDeletePreview = async (
  id: string
): Promise<AdminDeletePreview | null> => {
  const [collectionResult, affectedArtwork] = await Promise.all([
    CollectionModel.findById(id),
    ArtworkModel.find({ collections: id }),
  ]);
  const collection = toDocument(collectionResult);
  if (!collection) {
    return null;
  }

  const artworkRecords = recordsFromDocuments(
    "artwork",
    toDocuments(affectedArtwork),
    { field: "collections" }
  );
  const target = targetRecord("collection", collection, id);
  const preservedAssets = compactRecords([
    cloudinaryUrlRecord(collection.imageUrl, "imageUrl"),
  ]);

  return preview(
    "collection",
    target,
    [],
    [
      impact(
        "delete",
        "collection",
        [target],
        "Delete the target collection record."
      ),
    ],
    artworkRecords.length > 0
      ? [
          impact(
            "update",
            "artwork",
            artworkRecords,
            "Pull the collection ID from affected artwork collections arrays."
          ),
        ]
      : [],
    [
      ...(preservedAssets.length > 0
        ? [
            impact(
              "preserve",
              "cloudinaryAsset",
              preservedAssets,
              "Current collection deletion preserves referenced Cloudinary assets."
            ),
          ]
        : []),
    ]
  );
};

export const getCommentDeletePreview = async (
  id: string
): Promise<AdminDeletePreview | null> => {
  const comment = toDocument(await CommentModel.findById(id));
  if (!comment) {
    return null;
  }

  const target = targetRecord("comment", comment, id);
  const authorId = toStringValue(comment.author);
  const blogId = toStringValue(comment.blog);

  return preview(
    "comment",
    target,
    [],
    [
      impact("delete", "comment", [target], "Delete the target comment record."),
    ],
    [
      ...(authorId
        ? [
            impact(
              "update",
              "user",
              recordsFromIds("user", [authorId], { field: "comments" }),
              "Pull the deleted comment ID from the comment author's comments array."
            ),
          ]
        : []),
      ...(blogId
        ? [
            impact(
              "update",
              "blog",
              recordsFromIds("blog", [blogId], { field: "comments" }),
              "Pull the deleted comment ID from the related blog comments array."
            ),
          ]
        : []),
    ],
    []
  );
};

export const getUserDeletePreview = async (
  id: string,
  adminUserId: string
): Promise<AdminDeletePreview | null> => {
  const user = toDocument(await UserModel.findById(id));
  if (!user) {
    return null;
  }

  const commentIds = fieldIds(user.comments);
  const comments = toDocuments(
    commentIds.length > 0
      ? await CommentModel.find({ _id: { $in: commentIds } })
      : []
  );
  const blogIds = unique(
    comments.flatMap((comment) => {
      const blogId = toStringValue(comment.blog);
      return blogId ? [blogId] : [];
    })
  );
  const watchlistIds = fieldIds(user.watchlist);
  const favouriteIds = fieldIds(user.favourites);
  const target = targetRecord("user", user, id);
  const blockingConditions: AdminDeletePreviewBlocker[] = [];

  if (id === adminUserId) {
    blockingConditions.push({
      code: "current_admin_account",
      message: "Cannot delete the current admin account.",
      severity: "blocking",
      records: [target],
    });
  }

  if (toStringValue(user.role) === "admin") {
    const adminCount = Number(await UserModel.countDocuments({ role: "admin" }));
    if (adminCount <= 1) {
      blockingConditions.push({
        code: "last_admin_account",
        message: "Cannot delete the last remaining admin account.",
        severity: "blocking",
        records: [target],
      });
    }
  }

  return preview(
    "user",
    target,
    blockingConditions,
    [
      impact("delete", "user", [target], "Delete the target user record."),
      ...(commentIds.length > 0
        ? [
            impact(
              "delete",
              "comment",
              recordsFromIds("comment", commentIds),
              "Delete comments referenced by the target user."
            ),
          ]
        : []),
    ],
    [
      ...(blogIds.length > 0
        ? [
            impact(
              "update",
              "blog",
              recordsFromIds("blog", blogIds, { field: "comments" }),
              "Pull deleted user comment IDs from affected blog comments arrays."
            ),
          ]
        : []),
      ...(watchlistIds.length > 0
        ? [
            impact(
              "update",
              "artwork",
              recordsFromIds("artwork", watchlistIds, {
                field: "watcherlist",
              }),
              "Pull the deleted user ID from artwork watcherlist arrays."
            ),
          ]
        : []),
      ...(favouriteIds.length > 0
        ? [
            impact(
              "update",
              "artwork",
              recordsFromIds("artwork", favouriteIds, {
                field: "favourited",
              }),
              "Pull the deleted user ID from artwork favourited arrays."
            ),
          ]
        : []),
    ],
    []
  );
};
