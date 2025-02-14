export function filterMongoIdArr(arr: string[], id: string): string[] {
  return arr.filter((item) => item == id);
}
