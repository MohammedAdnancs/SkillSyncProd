"use client";

import { useSearchParams as useNextSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useSearchParamsSafe() {
  const searchParams = useNextSearchParams();
  const [params, setParams] = useState<URLSearchParams | null>(null);
  
  useEffect(() => {
    setParams(searchParams);
  }, [searchParams]);
  
  return params;
}
