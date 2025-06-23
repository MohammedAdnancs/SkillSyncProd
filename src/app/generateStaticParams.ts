// This configuration applies to the root app directory
// It specifies how Next.js should handle static generation

// By declaring this function empty, we're telling Next.js that we'll handle
// route generation manually at more specific levels
export function generateStaticParams() {
  // Return an empty array for the root 
  return [];
}
