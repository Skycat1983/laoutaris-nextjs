import { FeedSkeleton } from "@/components/compositions/Feed";
import { UseFeedSwitcherReturn } from "@/hooks/useFeedSwitcher";

//!: RENDERPROPS PATTERN

// 1. FeedSwitcher
// 2. FeedSwitcherHeadless
// 3. useFeedSwitcher (Custom Hook)

/* 
4. FeedSwitcherUI
   - This is the presentational (UI) component.
   - It receives all the feed-switching state and functions as props.
   - It renders:
     • A set of buttons for each available feed (letting the user change the selection),
     • And the component corresponding to the current feed.
   - It is completely decoupled from the logic of how the data is obtained or managed.
   - Its only concern is “how” things are rendered.
*/

export function FeedSwitcherUI({
  selectedFeed,
  setSelectedFeed,
  availableFeeds,
  currentFeedComponent: CurrentFeedComponent,
  isLoading,
}: UseFeedSwitcherReturn) {
  if (isLoading) {
    return <FeedSkeleton />;
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {availableFeeds.map((config) => (
          <button
            key={config.key}
            onClick={() => setSelectedFeed(config.key)}
            className={`px-4 py-2 rounded ${
              selectedFeed === config.key
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {config.title}
          </button>
        ))}
      </div>

      {CurrentFeedComponent && <CurrentFeedComponent />}
    </div>
  );
}
