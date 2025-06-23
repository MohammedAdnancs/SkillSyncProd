# Next.js App Router Deployment Notes

This application uses Next.js App Router with server-side rendering enabled.

## Configuration Change

We removed the static export configuration (`output: "export"`) because:

1. The application has many dynamic routes that rely on user authentication
2. Many pages fetch data server-side or use client-side hooks like `useSearchParams`
3. The application benefits more from server-side rendering for SEO and performance

## Deployment Options

### Standard Next.js Deployment

The application can be deployed to platforms that support Next.js server-side rendering:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted Node.js server

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

### Important Notes

- Authentication flows work better with server-side rendering
- Dynamic routes like `/workspaces/[workspaceId]/Roles` no longer need `generateStaticParams()`
- Image optimization is enabled by default
