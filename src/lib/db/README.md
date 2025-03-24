# MongoDB Connection Utilities

This directory contains utilities for connecting to MongoDB in a Next.js application with serverless functions.

## Key Files

- `mongodb.ts`: Mongoose connection with retry logic and caching
- `clientPromise.ts`: Raw MongoDB driver connection for Next-Auth
- `connectWithRetry.ts`: A wrapper utility for API routes
- `adapter.ts`: Custom MongoDB adapter for Next-Auth

## Connection Issues in Serverless Environments

When deploying to serverless environments like Vercel, MongoDB connections can time out during cold starts. The utilities in this directory are designed to address these issues by:

1. Adding proper retry logic with exponential backoff
2. Optimizing connection parameters for serverless environments
3. Better error handling and logging
4. Connection caching where appropriate

## Example Usage in API Routes

```typescript
import { withDbConnect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { YourModel } from "@/lib/data/models";

export async function GET(req: NextRequest) {
  return await withDbConnect(async () => {
    // Your route handler code here, MongoDB is connected
    const data = await YourModel.find({});
    return NextResponse.json({ success: true, data });
  });
}
```

## Best Practices

1. Use `withDbConnect` in all API routes
2. Don't mix mongoose and raw MongoDB driver in the same route
3. Use proper error handling with try/catch blocks
4. Be mindful of connection limits in your MongoDB Atlas tier

## Common Issues

- **Connection Timeouts**: Usually caused by cold starts in serverless functions
- **Too Many Connections**: Caused by not properly reusing connections
- **Memory Leaks**: Caused by not closing connections properly

The utilities in this directory are designed to handle these issues automatically.
