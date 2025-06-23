// Generate static params for the Roles route
// This tells Next.js what paths to pre-generate for this dynamic route
export function generateStaticParams() {
  // Return an empty array as this is an authenticated route that should be rendered dynamically
  return [];
}

// Mark as dynamic to ensure proper handling with static export
export const dynamic = 'force-dynamic';
