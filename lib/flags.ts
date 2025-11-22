// Centralized feature flags
// For production, you can map these to environment variables.
export const flags = {
  enableAdvancedAI: true, // Enable advanced AI features for all clients
};

export type Flags = typeof flags;
