import { readFileSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const renderSourceFiles = [
  "src/app/layout.tsx",
  "src/components/modules/navigation/subnav/Subnav.tsx",
  "src/components/views/ArticleView.tsx",
  "src/components/views/DesktopArticleView.tsx",
  "src/components/views/UserCommentsView.tsx",
];

const userFacingClientDebugSourceFiles = [
  "src/contexts/ClientContextBoundary.tsx",
  "src/components/artwork/ArtworkGallery.tsx",
  "src/components/views/BlogDetail.tsx",
  "src/components/modules/forms/user/EnquiryForm.tsx",
  "src/components/loaders/sectionLoaders/SubscribeSectionLoader.tsx",
  "src/app/account/favourites/[artworkId]/page.tsx",
  "src/components/modules/pagination/CollectionViewPagination.tsx",
];

const adminDashboardFormDebugSourceFiles = [
  "src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx",
  "src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx",
  "src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx",
  "src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx",
  "src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx",
  "src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx",
  "src/components/features/adminDashboard/inputs/ArtworkFilterDropdowns.tsx",
];

const adminReadCopyDebugSourceFiles = [
  "src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx",
  "src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx",
  "src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx",
  "src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx",
  "src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx",
  "src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx",
  "src/components/modules/cards/ArtworkFeedCard.tsx",
  "src/lib/helpers/copy_id.ts",
];

const sharedUiPublicFetcherDebugSourceFiles = [
  "src/components/compositions/Feed.tsx",
  "src/components/elements/buttons/NavItem.tsx",
  "src/components/elements/buttons/RefreshButton.tsx",
  "src/components/elements/misc/YoutubeEmbedding.tsx",
  "src/lib/api/public/artwork/fetchers.ts",
];

describe("render source hygiene", () => {
  it("keeps public and account render files free of direct console.log debugging", () => {
    for (const sourceFile of renderSourceFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(/console\.log\s*\(/);
    }
  });

  it("keeps retired render debug strings out of public and account render files", () => {
    const combinedSource = renderSourceFiles.map(readRepoFile).join("\n");

    expect(combinedSource).not.toMatch(
      /Branch verification test|article in ArticleView|console\.log\("links"|console\.log\("comments"|console\.log\("title"/
    );
  });

  it("keeps user-facing public and account client files free of direct console.log debugging", () => {
    for (const sourceFile of userFacingClientDebugSourceFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(/console\.log\s*\(/);
    }
  });

  it("keeps retired user-facing client debug strings out of scoped source files", () => {
    const combinedSource = userFacingClientDebugSourceFiles
      .map(readRepoFile)
      .join("\n");

    expect(combinedSource).not.toMatch(
      /Session not available in ClientContextBoundary|initialArtworks|initialSort|initialFilters|result of submit enquiry|session in SubscribeSectionLoader|console\.log\("items"|console\.log\("result"|console\.log\("artworkId"/
    );
  });

  it("keeps admin dashboard form and filter files free of direct console.log debugging", () => {
    for (const sourceFile of adminDashboardFormDebugSourceFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(/console\.log\s*\(/);
    }
  });

  it("keeps admin read-list copy files free of direct console.log debugging", () => {
    for (const sourceFile of adminReadCopyDebugSourceFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(/console\.log\s*\(/);
    }
  });

  it("keeps shared UI and public artwork fetcher files free of direct console.log debugging", () => {
    for (const sourceFile of sharedUiPublicFetcherDebugSourceFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(/console\.log\s*\(/);
    }
  });

  it("keeps retired shared UI and public fetcher debug strings out of scoped source files", () => {
    const combinedSource = sharedUiPublicFetcherDebugSourceFiles
      .map(readRepoFile)
      .join("\n");

    expect(combinedSource).not.toMatch(
      /console\.log\("metadata"|console\.log\("clicked"|console\.log\("Refresh clicked"|Missing videoId in YoutubeEmbedding component|Fetching URL:/
    );
  });
});
