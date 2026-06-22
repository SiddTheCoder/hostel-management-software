import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
const candidateRoots = [process.cwd(), path.resolve(process.cwd(), "../..")];
const repoRoot =
  candidateRoots.find((candidateRoot) => existsSync(path.join(candidateRoot, ".env"))) ??
  process.cwd();

loadEnvConfig(repoRoot);
