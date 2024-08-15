

// might be deprecated actually
/**
 * Checks whether a line in the script is PDF page separators.
 * @param line The line to check.
 */
export function isPageSeparator(line: string): boolean {
  const pageSeparatorPattern = /^\s*-\d+-\s*$/i;
  return pageSeparatorPattern.test(line);
}