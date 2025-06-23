// This file defines which routes are statically pre-rendered at build time
// For dynamic routes where we want to pre-render specific paths

export function generateStaticParams() {
  return [
    // Landing page related static paths
    { path: [''] }, // Home page
    { path: ['landingpage'] }, // Landing page
    
    // Define other static routes here that don't rely on dynamic params
    // Don't include routes that need authentication or dynamic data
  ]
}
