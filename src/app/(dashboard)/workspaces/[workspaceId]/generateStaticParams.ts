// This file defines static params for dynamic routes
// Since this is an authenticated route, we'll use a dynamic strategy instead of pre-rendering

export function generateStaticParams() {
  // For static export with dynamic routes, we need to return an empty array
  // This tells Next.js not to try to pre-render any paths for this dynamic route
  // Instead, the routes will be generated on-demand at runtime or during client-side navigation
  return [];
}

// Mark the route as dynamic to ensure proper handling with static export
export const dynamic = 'force-dynamic';
