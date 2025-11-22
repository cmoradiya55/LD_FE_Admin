# Feature Flags

This project uses a simple, centralized feature flag system to toggle product features at runtime.

- Source of truth: `lib/flags.ts`
- App-wide access: `components/FlagsProvider.tsx` wraps the app in `app/layout.tsx`

## Advanced AI flag

- Key: `enableAdvancedAI`
- Default: `true` (enabled for all clients)

You can override flags by passing a `value` prop to `FlagsProvider` (e.g., based on environment variables):

```tsx
// app/layout.tsx
import { FlagsProvider } from '@/components/FlagsProvider';

const overrides = {
  enableAdvancedAI: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_AI === 'true',
};

<FlagsProvider value={overrides}>...</FlagsProvider>
```

If you don't need environment overrides, edit `lib/flags.ts` directly.
