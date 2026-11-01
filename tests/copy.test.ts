import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const sourceFiles = walk("src").filter((file) => /\.(ts|tsx|css)$/.test(file));
const contentFiles = walk("src/content").filter((file) => file !== "src/content/types.ts");

const BANNED = /\b(synergy|scale|scaling|leverage|10x|growth hacking|crushing it|cutting-edge|world-class|results-driven|game-changing|ai-powered|ai-native|smart|intelligent|revolutionize|unlock|elevate|supercharge)\b/i;
const MECHANICS = /\b(gohighlevel|ghl|crm|funnels?|landing pages?|surveys?|instant forms?|automations?|webhooks?|make\.com|slack|snapshots?|pixel|capi|philippines|ad sets?|campaigns?|budgets?|guarantee[ds]?)\b/i;

function stripComments(source: string) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\s\/\/ .*$/gm, "")
    .replace(/\bbudget:/g, ""); // The ?reason=budget key, not visible copy.
}

describe("copy rules", () => {
  it("has no em or en dashes anywhere in src", () => {
    const offenders = sourceFiles.filter((file) => /[\u2013\u2014]/.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });

  it.each(contentFiles)("%s has no banned words", (file) => {
    expect(stripComments(readFileSync(file, "utf8")).match(BANNED)).toBeNull();
  });

  it.each(contentFiles)("%s does not reveal delivery mechanics or promise leads", (file) => {
    expect(stripComments(readFileSync(file, "utf8")).match(MECHANICS)).toBeNull();
  });
});
