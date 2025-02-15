"use client";

import { FeedSwitcherHeadless } from "./FeedSwitcherHeadless";
import { FeedSwitcherUI } from "./FeedSwitcherUI";

//!: RENDERPROPS PATTERN
/* 
1. FeedSwitcher
   - This is the composite component that ties everything together.
   - It renders the headless component (FeedSwitcherHeadless) and passes in a render function.
   - The render function receives the feed-switcher state/logic and passes it to the UI component (FeedSwitcherUI).
   - This hides the internal details and provides a simple interface: <FeedSwitcher />.
*/

// 2. FeedSwitcherHeadless
// 3. useFeedSwitcher (Custom Hook)
// 4. FeedSwitcherUI

export function FeedSwitcher() {
  return (
    <FeedSwitcherHeadless render={(props) => <FeedSwitcherUI {...props} />} />
  );
}
