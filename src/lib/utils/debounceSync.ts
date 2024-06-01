type DebouncedFunctionSync<T extends any[], R> = ((...args: T) => R) & {
  clear: () => void
}

/**
 * Example usage:
 * ```typescript
 *   function fetchDataSync(query: string): string {
 *     return `Results for ${query}`;
 *   }
 *
 *   const debouncedFetchDataSync = debounceSync(fetchDataSync, 300);
 *
 *   try {
 *    console.log(debouncedFetchDataSync("query 1")); // This will be ignored
 *     console.log(debouncedFetchDataSync("query 2")); // This will be ignored
 *     console.log(debouncedFetchDataSync("query 3")); // This will return "Results for query 3"
 *   } catch (error) {
 *     console.error(error);
 *   }
 * ```
 *
 * Note that the synchronous version of the debounce function will return
 * the result of the last function call or `undefined` if the function was
 * not called within the specified wait time. You should also be aware that
 * this synchronous version may cause blocking if the debounced function
 * takes a long time to execute.
 *
 * @param func
 * @param wait
 * @returns
 */
export function debounceSync<T extends any[], R>(
  func: (...args: T) => R,
  wait: number
): DebouncedFunctionSync<T, R | undefined> {
  let timeout: NodeJS.Timeout | undefined

  const debounced = (...args: T): R | undefined => {
    if (timeout) {
      clearTimeout(timeout)
    }

    let result: R | undefined
    timeout = setTimeout(() => {
      result = func(...args)
    }, wait)

    return result
  }

  debounced.clear = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  return debounced
}