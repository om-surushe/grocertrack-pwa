# Contributing

Keep changes focused and preserve the browser-only data model.

```bash
npm ci
npm audit --audit-level=high
npm run typecheck
npm test
npm run build
```

Describe the behaviour changed and the checks you ran in the pull request. Do not commit build output, environment files, or unrelated formatting changes.
