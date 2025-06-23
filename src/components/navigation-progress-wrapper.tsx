"use client";

import { Suspense } from "react";
import { NavigationProgress } from "./nprogress";

export function NavigationProgressWrapper() {
  return (
    <Suspense fallback={null}>
      <NavigationProgress />
    </Suspense>
  );
}
