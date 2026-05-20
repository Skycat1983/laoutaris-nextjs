export const ADMIN_DELETE_EVIDENCE_REFERENCE_MIN_LENGTH = 3;
export const ADMIN_DELETE_EVIDENCE_REFERENCE_MAX_LENGTH = 200;

export type AdminDeleteEvidence = {
  backupExportConfirmed: boolean;
  backupExportReference: string;
  ownerReviewConfirmed: boolean;
  ownerReviewReference: string;
};

export const createEmptyAdminDeleteEvidence = (): AdminDeleteEvidence => ({
  backupExportConfirmed: false,
  backupExportReference: "",
  ownerReviewConfirmed: false,
  ownerReviewReference: "",
});

export const normalizeAdminDeleteEvidence = (
  evidence: AdminDeleteEvidence
): AdminDeleteEvidence => ({
  backupExportConfirmed: evidence.backupExportConfirmed,
  backupExportReference: evidence.backupExportReference.trim(),
  ownerReviewConfirmed: evidence.ownerReviewConfirmed,
  ownerReviewReference: evidence.ownerReviewReference.trim(),
});

export const isAdminDeleteEvidenceComplete = (
  evidence: AdminDeleteEvidence
) => {
  const normalizedEvidence = normalizeAdminDeleteEvidence(evidence);

  return (
    normalizedEvidence.backupExportConfirmed &&
    normalizedEvidence.ownerReviewConfirmed &&
    normalizedEvidence.backupExportReference.length >=
      ADMIN_DELETE_EVIDENCE_REFERENCE_MIN_LENGTH &&
    normalizedEvidence.ownerReviewReference.length >=
      ADMIN_DELETE_EVIDENCE_REFERENCE_MIN_LENGTH
  );
};
