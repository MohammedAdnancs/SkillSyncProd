"use client";

import { Suspense } from "react";
import { RepositoryViewer } from "./repository-viewer";

export function RepositoryViewerWrapper() {
  return (
    <Suspense fallback={<div>Loading repository...</div>}>
      <RepositoryViewer />
    </Suspense>
  );
}
