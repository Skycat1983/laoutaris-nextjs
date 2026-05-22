export const ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_NAME =
  "accountPrivacyAcknowledged";
export const ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_VALUE = "accepted";
export const ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_REQUIRED_MESSAGE =
  "Please acknowledge the Privacy Policy and Terms of Use before creating an account.";

export const ACCOUNT_PRIVACY_VERSION = "2026-05-22-owner-approval-v1";
export const ACCOUNT_TERMS_VERSION = "2026-05-22-owner-approval-v1";

export const ACCOUNT_ACKNOWLEDGEMENT_SOURCE_SURFACES = [
  "credentials-signup",
  "oauth-provider-sign-in",
] as const;

export const ACCOUNT_ACKNOWLEDGEMENT_ACCEPTED_BY = [
  "credentials",
  "oauth",
] as const;

export const ACCOUNT_ACKNOWLEDGEMENT_PROVIDERS = [
  "credentials",
  "oauth",
] as const;

export type AccountAcknowledgementSourceSurface =
  (typeof ACCOUNT_ACKNOWLEDGEMENT_SOURCE_SURFACES)[number];

export type AccountAcknowledgementAcceptedBy =
  (typeof ACCOUNT_ACKNOWLEDGEMENT_ACCEPTED_BY)[number];

export type AccountAcknowledgementProvider =
  (typeof ACCOUNT_ACKNOWLEDGEMENT_PROVIDERS)[number];

export interface AccountPrivacyAcknowledgement {
  privacyVersion: string;
  termsVersion: string;
  acceptedAt: Date;
  acceptedBy: AccountAcknowledgementAcceptedBy;
  provider: AccountAcknowledgementProvider;
  sourceSurface: AccountAcknowledgementSourceSurface;
}

export const createAccountPrivacyAcknowledgement = ({
  acceptedBy,
  provider,
  sourceSurface,
}: {
  acceptedBy: AccountAcknowledgementAcceptedBy;
  provider: AccountAcknowledgementProvider;
  sourceSurface: AccountAcknowledgementSourceSurface;
}): AccountPrivacyAcknowledgement => ({
  privacyVersion: ACCOUNT_PRIVACY_VERSION,
  termsVersion: ACCOUNT_TERMS_VERSION,
  acceptedAt: new Date(),
  acceptedBy,
  provider,
  sourceSurface,
});
