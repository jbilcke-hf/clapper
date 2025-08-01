import { DependencyList, useEffect, useRef } from "react"

export function useAnimationFrame(callback: (time: number) => void, deps: DependencyList | undefined = []) {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>(null)
  const previousTimeRef = useRef<number>(null)
  
  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current as any);
  }, deps); // Make sure the effect runs only once
}