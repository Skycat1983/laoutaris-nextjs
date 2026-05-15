import {
  EXTENDED_PUBLIC_USER_FIELDS,
  ExtendedPublicUserFields,
  SENSITIVE_PUBLIC_USER_FIELDS,
  SensitivePublicUserFields,
  USER_FIELD_EXTENDER,
} from "@/lib/constants";
import { UserBase, UserDB } from "@/lib/data/models";
import { createTransformer } from "@/lib/transforms";

export const transformUser = createTransformer<
  UserDB,
  UserBase,
  ExtendedPublicUserFields,
  SensitivePublicUserFields
>(
  EXTENDED_PUBLIC_USER_FIELDS,
  SENSITIVE_PUBLIC_USER_FIELDS,
  USER_FIELD_EXTENDER
);
