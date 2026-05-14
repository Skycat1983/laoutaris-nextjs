# 0002 - Use AGENTS.md Plus Docs README As Entry Points

Status: Accepted

Date: 2026-05-14

## Context

Future agents need a predictable first-read document and a deeper project index.
Putting everything in the root README would mix product-facing project
description with operational refactor guidance.

## Decision

Use root `AGENTS.md` for mandatory agent operating rules and `docs/README.md` as
the canonical documentation index.

## Consequences

- Agents should read `AGENTS.md` first.
- `docs/README.md` owns the documentation map.
- The root README can stay concise and product-facing.
