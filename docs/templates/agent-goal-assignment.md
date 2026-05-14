# Agent Goal Assignment

Use this template when the orchestrator commissions another agent.

```text
/goal effort: high details: docs/audits/goals.md#a-nnn-audit-slug
```

Assignments must be one line. Put detailed instructions in the linked goal,
result file, workstream, or task brief before commissioning the agent.

Do not send the assignment until the linked details document includes scope,
read-first dependencies, write location, concurrency expectations, verification,
and escalation criteria.

Use `/goal` for audit or discovery work. Use `/task` for bounded implementation,
review, or reconciliation work.

Default effort is `high`. Use `xhigh` for broad architecture, security,
compliance, SSR/data-fetching, or ambiguous cross-cutting work.
