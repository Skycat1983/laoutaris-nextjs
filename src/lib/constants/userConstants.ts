const USER_ROLES = ["user", "admin"] as const;
type UserRole = (typeof USER_ROLES)[number];

export type { UserRole };
export { USER_ROLES };
