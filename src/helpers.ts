export function replaceAll(input: string, ...regex: string[]): string {
  const bulkReplace = regex.reduce((acc, r) => input.replace(r, input), "");
  return bulkReplace;
}
