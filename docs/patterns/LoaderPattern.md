# Loader Pattern Blueprint

## 1. API Layer (`/lib/api/[resource]Api.ts`)

```typescript
interface FetchParams {
readonly fields?: readonly string[];
// ... other common params (pagination, filters)
}
async function fetchResource {
// Build URL params
// Make fetch call
// Type-check response
// Return data
}
```

## 2. Transform Layer (`/lib/transforms/dataTransforms.ts`)

```typescript
// Generic transform utilities
function transformToPick<T, K extends keyof T>(
  data: T,
  fields: readonly K[]
): Pick<T, K>;
```

## 3. Loader Component (`/components/loaders/[Component]Loader.tsx`)

```typescript
// 1. Config Constants
const FETCH_CONFIG = {
  fields: [...] as const,
  // ... other params
} as const;

// 2. Type Definitions
type ComponentData = Pick<BaseType, typeof FETCH_CONFIG.fields[number]>;

// 3. Loader Function
export async function ComponentLoader() {
  try {
    // Fetch data using API layer
    const rawData = await fetchResource(FETCH_CONFIG);

    // Transform data using transform layer
    const transformedData = rawData.map(item =>
      transformToPick(item, FETCH_CONFIG.fields)
    );

    // Return component with transformed data
    return <Component data={transformedData} />;
  } catch (error) {
    // Handle errors
    return null;
  }
}
```

## 4. Presentation Component (`/components/[Component].tsx`)

```typescript
interface ComponentProps {
  data: ComponentData[];
}

export function Component({ data }: ComponentProps) {
  // Render UI
}
```

## Key Principles:

1. Separate concerns (API, transforms, loading, presentation)
2. Type safety with readonly and as const
3. Reusable fetch and transform utilities
4. Consistent error handling
5. Clear data flow
6. Centralized configuration

## Flow:

API Call → Data Transform → Component Render

## Common Patterns:

- Field selection
- Pagination
- Filtering
- Error handling
- Type safety

## Example Implementation:

See:

- `/lib/api/articleApi.ts`
- `/lib/transforms/dataTransforms.ts`
- `/components/loaders/HomeBiographySectionLoader.tsx`
- `/components/homepageSections/HomeBiographySection.tsx`
