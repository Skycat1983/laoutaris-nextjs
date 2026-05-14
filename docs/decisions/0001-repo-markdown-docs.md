# 0001 - Repo Markdown Is The Canonical Planning System

Status: Accepted

Date: 2026-05-14

## Context

The project will be refactored by multiple agents over time. Chat history is not
a stable source of truth, and external trackers may not be available to every
agent.

## Decision

Use versioned Markdown in the repo as the canonical planning and progress
system.

## Consequences

- Workstream briefs track active work and progress.
- ADRs track durable decisions.
- Risk docs track unresolved production issues.
- GitHub Issues can still be used later, but they should not replace the repo
  docs as the source of truth unless a new ADR changes this decision.
