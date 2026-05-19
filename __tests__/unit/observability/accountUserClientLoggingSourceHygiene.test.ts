import { readFileSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const accountUserClientFiles = [
  "src/components/modules/forms/user/ContactForm.tsx",
  "src/components/modules/forms/user/CommentForm.tsx",
  "src/components/modules/forms/user/LogoutForm.tsx",
  "src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx",
  "src/components/modules/cards/CommentCard.tsx",
  "src/components/modules/error/ErrorBoundary.tsx",
];

describe("account and user client logging source hygiene", () => {
  it("keeps scoped account/user clients free of direct console error and warn calls", () => {
    for (const sourceFile of accountUserClientFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(
        /console\.(error|warn)\s*\(/
      );
    }
  });

  it("keeps retired raw account/user client failure logging strings out of scoped source files", () => {
    const combinedSource = accountUserClientFiles.map(readRepoFile).join("\n");

    expect(combinedSource).not.toMatch(
      /Submission error:|Error submitting comment:|Logout failed:|Failed to update comment:|Failed to delete comment:|Error caught by boundary:/
    );
  });
});
