import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (e.code === key) callback();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, callback]);
}
