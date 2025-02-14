export async function sanitizeData(data: any) {
  return JSON.parse(JSON.stringify(data));
}
