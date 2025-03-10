````markdown:my-app/README.md
# Next.js Clean Architecture Project

This project implements a clean, use-case driven architecture that emphasizes separation of concerns and maintainable code structure. The architecture is designed to handle complex data flows while keeping components simple and focused.

## Architectural Overview

The application follows a layered architecture where data flows through distinct layers:

```plaintext
UI Layer (Components) → Use Cases → Data Fetching → API Routes → Database
     ↑                                                              |
     └──────────────────────── Data Flow ───────────────────────────┘
```

### Directory Structure

```plaintext
src/
├── app/                          # Next.js App Router pages and layouts
│   ├── api/                      # API routes organized by domain
│   │   ├── artwork/             # Artwork-specific endpoints
│   │   └── user/                # User-specific endpoints
│   └── (routes)/                # Page routes and layouts
├── components/
│   ├── ui/                      # Reusable UI components
│   │   └── inputs/             # Form inputs, buttons, etc.
│   └── views/                   # Page-specific view components
└── lib/
    └── server/                  # Server-side business logic
        ├── artwork/             # Domain: Artwork
        │   ├── actions/         # Server actions (mutations)
        │   ├── data-fetching/   # Data retrieval functions
        │   ├── models/          # Data models and types
        │   ├── resolvers/       # Data transformation logic
        │   └── use_cases/       # Business logic orchestration
        └── user/                # Domain: User (similar structure)
```

## Key Architectural Principles

### 1. Component-Data Separation
- Pages/layouts are kept minimal, delegating to view components
- View components receive data-fetching functions as props
- Data fetching logic is isolated from UI components

### 2. Use Case Pattern
Located in `/lib/server/*/use_cases/`
```typescript
// Example use case structure
export function useArtworkDetails(id: string) {
  return {
    getData: async () => {
      const data = await fetchArtwork({
        identifierKey: 'id',
        identifierValue: id,
        fields: ['title', 'image']
      });
      return transformArtworkData(data);
    }
  };
}
```

### 3. Data Fetching Layer
Located in `/lib/server/*/data-fetching/`
- Generic fetch functions organized by domain
- Consistent parameter pattern:
  - `identifierKey`: Field to query by
  - `identifierValue`: Value to match
  - `fields`: Properties to return

```typescript
// Example data fetching structure
export async function fetchArtwork({
  identifierKey,
  identifierValue,
  fields
}: FetchParams) {
  const query = formatQuery(identifierKey, identifierValue, fields);
  return await fetch(`/api/artwork?${query}`);
}
```

### 4. API Route Structure
Located in `/app/api/`
- Routes follow pattern: `/api/[collection]/[populatedItem]`
- Minimal logic in route handlers
- Delegates to use cases for business logic

```typescript
// Example API route structure
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = await handleArtworkQuery(searchParams);
  return Response.json(data);
}
```

## Data Flow Example

1. Component needs data:
```typescript
function ArtworkView({ getArtwork }: { getArtwork: () => Promise<PublicArtwork> }) {
  // Component receives data fetching function as prop
}
```

2. Use case orchestrates the operation:
```typescript
// use_cases/getArtwork.ts
const data = await fetchArtwork({ identifierKey, identifierValue, fields });
return transformArtworkData(data);
```

3. Data fetcher makes the API call:
```typescript
// data-fetching/fetchArtwork.ts
const response = await fetch(`/api/artwork?${queryString}`);
```

4. API route handles the request:
```typescript
// api/artwork/route.ts
const data = await db.artwork.findUnique({ ... });
```

## Benefits of this Architecture

1. **Maintainability**: Each layer has a single responsibility
2. **Testability**: Business logic is isolated from UI
3. **Scalability**: New features follow established patterns
4. **Reusability**: Functions are composable and generic
5. **Type Safety**: Full TypeScript support across layers

```

````
