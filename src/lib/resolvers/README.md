## Resolver Functions: Purpose and Design

These resolver functions are used to convert the data from the backend to the frontend.
This is useful when the backend data structure differs from the frontend's expected data structure.

### Why/Where is this used?

- The `layout.tsx` file of our `collections` and `biography` routes both render a `SubNav` component.
- Each `SubNav` component requires an array of `SubNavBarLink` objects to render navigation links.
- The data-fetching function differs for each route (e.g., fetching collections vs. biographies).

#### Problem

- Fetching in `layout.tsx` was preventing the use of React Suspense and fallback Skeletons.

#### Solution

- The fetching logic was moved to the `SubNav` component, allowing the layout to manage the fallback UI.
- To keep things reusable, we pass fetch/resolve functions as props to `SubNav`, instead of duplicating the component.

#### Higher-Order Function

- To simplify usage, a higher-order function was created. It takes fetch/resolve functions as arguments and returns a preconfigured function that can be passed to `SubNav` as a prop.
