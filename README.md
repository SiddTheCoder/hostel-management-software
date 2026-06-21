# hostel-management-software

## Agent Context

This project uses Graphify for fast codebase orientation.

- Start with `AGENTS.md` for Codex.
- Start with `CLAUDE.md` for Claude.
- Treat `graphify-out/` as the canonical agent-context folder.
- Read `graphify-out/GRAPH_REPORT.md` before broad file searches.
- If present, use `graphify-out/wiki/index.md` for relevant context before raw file reads.
- Use `graphify query`, `graphify path`, and `graphify explain` for architecture questions.
- Run `graphify update .` after uncommitted code changes if the graph is stale.
- Graphify hooks update the graph after commits/checkouts, and the local pre-push hook runs `graphify update .` before pushes.
- Keep `graphify-out/` committed with code after the first graph is generated; do not add it to `.gitignore`.
