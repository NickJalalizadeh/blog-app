import { useCallback, useRef } from "react";

// Debounce function to limit the rate of function calls
function debounce<T extends unknown[]>(
  func: (...args: T) => unknown,
  delay: number
): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export default function useDebounce<T extends unknown[]>(
  func: (...args: T) => unknown,
  delay: number
) {
    const debounceRef = useRef(debounce(func, delay));

    return useCallback((...args: T) => 
      debounceRef.current(...args),
    []);
}