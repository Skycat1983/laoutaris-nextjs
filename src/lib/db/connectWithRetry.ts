import dbConnect from "./mongodb";

/**
 * A utility function to connect to MongoDB with retry logic for API route handlers
 * This ensures consistent connection handling and error reporting across all routes
 *
 * Usage:
 * ```
 * export async function GET(req: NextRequest) {
 *   return await withDbConnect(async () => {
 *     // Your route handler code here
 *     // MongoDB is connected and ready to use
 *     return NextResponse.json({ success: true, data: result });
 *   });
 * }
 * ```
 */
export async function withDbConnect<T>(handler: () => Promise<T>): Promise<T> {
  // Use the improved dbConnect with retry from mongodb.ts
  await dbConnect();

  // Execute the handler function once connected
  return await handler();
}

export default withDbConnect;
