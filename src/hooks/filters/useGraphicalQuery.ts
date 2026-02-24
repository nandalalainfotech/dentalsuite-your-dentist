/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export function useGraphicalQuery() {
  const [query, setQuery] = useState<any>(null);

  return {
    query,
    setQuery
  };
}