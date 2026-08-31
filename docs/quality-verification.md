# Quality verification

The platform build currently covers the normalized trace data module, route loader, sample export endpoint, and the helper modules under app/lib. The public workflow repeats type generation, strict TypeScript checking, and the production build on GitHub-hosted runners.

A passing check is required before calling the repository release-ready.
