import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;

    document.title = `Movie || ${title}`;

    return () => {
      document.title = "Vcinema";
    };
  }, [title]);
}
