# Codex Context

Codex reads `AGENTS.md` automatically. Start there for the canonical instructions.

Fast path:

1. Read `AGENTS.md`.
2. Read `graphify-out/GRAPH_REPORT.md` from the canonical `graphify-out/` context folder.
3. Use `graphify query`, `graphify path`, and `graphify explain` before broad file reads.
4. Read tracker or roadmap files only when the user mentions sprint, feature, or status work.
5. After code changes, keep `graphify-out/` fresh with `graphify update .`; the local pre-push hook also runs this before pushes.
