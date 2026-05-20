# T-171 Existing Content Image URL Audit

Status: Completed

Task: [T-171 Audit Existing Content Image URLs](../../tasks/T-171-audit-existing-content-image-urls.md)

Date: 2026-05-20

## Summary

The live read-only MongoDB audit found the existing article, blog, and
collection `imageUrl` values compatible with the current T-135 policy.

All 30 audited records use the configured Cloudinary delivery path
`https://res.cloudinary.com/dzncmfirr/**`. No accepted external allowlist URLs,
missing/empty values, malformed URLs, unsupported hosts, or mismatched
Cloudinary cloud/path values were found.

## Policy Checked

- Runtime validator:
  `src/lib/validation/contentImageUrl.ts`
- Next image allowlist:
  `next.config.mjs`
- Allowed content image sources:
  - `https://res.cloudinary.com/dzncmfirr/**`
  - `https://cdn-icons-png.flaticon.com/**`
  - `https://cdn.shopify.com/**`

## Data Access

Audit script:
`scripts/audit-content-image-urls.mjs`

The script connects with `MONGO_URI`, reads only the `articles`, `blogs`, and
`collections` collections, projects only `_id`, `slug`, and `imageUrl`, and
does not write or mutate records. Examples below omit query strings and include
only public host/path evidence.

## Counts

| Category | Articles | Blogs | Collections | Total |
| --- | ---: | ---: | ---: | ---: |
| Accepted Cloudinary | 7 | 17 | 6 | 30 |
| Accepted external allowlist host | 0 | 0 | 0 | 0 |
| Missing/empty where allowed | 0 | 0 | 0 | 0 |
| Malformed URL | 0 | 0 | 0 | 0 |
| Unsupported host | 0 | 0 | 0 | 0 |
| Mismatched Cloudinary cloud/path | 0 | 0 | 0 | 0 |

## Sanitized Examples

Accepted Cloudinary:

- article `later-years`:
  `res.cloudinary.com/dzncmfirr/image/upload/v1713358358/artwork/lfvalatlv33x5sghnbky.jpg`
- blog `video-problems`:
  `res.cloudinary.com/dzncmfirr/image/upload/v1707470723/art-thumbnails/JRL_w209_crop_sk0hud.jpg`
- collection `xxl`:
  `res.cloudinary.com/dzncmfirr/image/upload/v1713359817/artwork/lapbp1anawjzvayajq3s.jpg`
- article `contact`:
  `res.cloudinary.com/dzncmfirr/image/upload/v1741015741/artwork/lizm22vjcbmoniy3q0s0.jpg`
- blog `disaster!`:
  `res.cloudinary.com/dzncmfirr/image/upload/v1706775789/art-thumbnails/JRL_w096_crop_gpnpjj.jpg`

Other categories:

- Accepted external allowlist host: none.
- Missing/empty where allowed: none.
- Malformed URL: none.
- Unsupported host: none.
- Mismatched Cloudinary cloud/path: none.

## Verification

- `node scripts/audit-content-image-urls.mjs`: passed after loading `MONGO_URI`
  from local `.env` and running with network approval because sandboxed DNS to
  the configured MongoDB Atlas SRV host was blocked.
- `git diff --check`: passed.
- `git diff --check --no-index /dev/null <new T-171 file>`: no whitespace
  warnings for each new T-171 file; the non-zero exit is expected for
  `/dev/null` comparisons.

## Candidate Tracker Updates

- No findings-register or production-risk item is needed from this audit.
- The content/admin workstream backlog item to review existing blog, article,
  and collection image URLs against the T-135 policy can be marked reconciled
  to this report by the orchestrator.
