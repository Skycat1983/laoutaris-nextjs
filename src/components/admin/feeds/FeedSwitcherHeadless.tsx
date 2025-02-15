import { ReactNode } from "react";
import {
  useFeedSwitcher,
  UseFeedSwitcherReturn,
} from "@/hooks/useFeedSwitcher";

type RenderProps = UseFeedSwitcherReturn;

interface FeedSwitcherHeadlessProps {
  children: (props: RenderProps) => ReactNode;
}

//!: RENDERPROPS PATTERN
// 1. FeedSwitcher

/* 
2. FeedSwitcherHeadless
   - This is the "headless" component—it handles the logic but doesn’t dictate any UI.
   - It calls the custom hook (useFeedSwitcher) to obtain all the necessary state and functions.
   - It then uses the render props pattern: it expects its child to be a function, 
     which it calls with the feed-switcher state (feedSwitcherProps).
   - This allows the consumer (in our case, FeedSwitcherUI via FeedSwitcher) to decide how to render the UI.
*/
// 3. useFeedSwitcher (Custom Hook)
// 4. FeedSwitcherUI

export function FeedSwitcherHeadless({ children }: FeedSwitcherHeadlessProps) {
  const feedSwitcherProps = useFeedSwitcher();
  return <>{children(feedSwitcherProps)}</>;
}

//  children is not a react node, but a function that receives the hook's values and returns JSX. The function gets called with feedSwitcherProps.
