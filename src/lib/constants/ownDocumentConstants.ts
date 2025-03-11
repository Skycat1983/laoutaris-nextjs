//! OWN USER
// Sensitive data
export type SensitiveOwnUserFields = typeof SENSITIVE_OWN_USER_FIELDS;
export const SENSITIVE_OWN_USER_FIELDS = ["password"] as const;
// Additional fields
export const EXTENDED_OWN_USER_FIELDS = {
  isOwner: { type: "boolean", default: false },
} as const;
export type ExtendedOwnUserFields = typeof EXTENDED_OWN_USER_FIELDS;
