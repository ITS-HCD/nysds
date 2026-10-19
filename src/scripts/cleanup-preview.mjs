#!/usr/bin/env node
/**
 * Deletes accessibility preview deploys from Netlify.
 *
 * Every push to a PR creates a new deploy under the same pr-<number> alias
 * (see .github/workflows/preview.yaml), so cleanup removes all of them.
 *
 * Usage:
 *   node src/scripts/cleanup-preview.mjs 1970      delete every deploy of PR #1970
 *   node src/scripts/cleanup-preview.mjs --sweep   delete deploys of every closed or merged PR
 *
 * Env: NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID.
 * --sweep also needs GITHUB_TOKEN and GITHUB_REPOSITORY (owner/name).
 */

const NETLIFY_API = "https://api.netlify.com/api/v1";
const { NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID, GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;

async function netlify(path, { method = "GET" } = {}) {
  const res = await fetch(`${NETLIFY_API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Netlify ${method} ${path} → ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function listDeploys() {
  const deploys = [];
  for (let page = 1; ; page++) {
    const batch = await netlify(`/sites/${NETLIFY_SITE_ID}/deploys?page=${page}&per_page=100`);
    deploys.push(...batch);
    if (batch.length < 100) return deploys;
  }
}

/** The PR number a deploy belongs to, from its pr-<n> alias, or null. */
function prNumber(deploy) {
  const fromBranch = /^pr-(\d+)$/.exec(deploy.branch ?? "")?.[1];
  const fromUrl = /\/\/pr-(\d+)--/.exec(deploy.links?.alias ?? "")?.[1];
  return Number(fromBranch ?? fromUrl) || null;
}

async function isClosed(pr) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${pr}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub PR #${pr} → ${res.status}`);
  return (await res.json()).state === "closed";
}

async function main() {
  const arg = process.argv[2];
  const sweep = arg === "--sweep";
  const pr = Number(arg);
  if (!sweep && !Number.isInteger(pr)) {
    console.error("Usage: cleanup-preview.mjs <pr-number> | --sweep");
    process.exit(1);
  }
  if (!NETLIFY_AUTH_TOKEN || !NETLIFY_SITE_ID) throw new Error("NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID are required.");
  if (sweep && (!GITHUB_TOKEN || !GITHUB_REPOSITORY)) throw new Error("--sweep needs GITHUB_TOKEN and GITHUB_REPOSITORY.");

  // Netlify refuses to delete the published deploy; never try.
  const site = await netlify(`/sites/${NETLIFY_SITE_ID}`);
  const deploys = (await listDeploys()).filter((d) => d.id !== site.published_deploy?.id);

  const byPr = new Map();
  for (const deploy of deploys) {
    const n = prNumber(deploy);
    if (n === null || (!sweep && n !== pr)) continue;
    byPr.set(n, [...(byPr.get(n) ?? []), deploy]);
  }

  let deleted = 0;
  for (const [n, prDeploys] of byPr) {
    if (sweep && !(await isClosed(n))) continue;
    for (const deploy of prDeploys) {
      await netlify(`/deploys/${deploy.id}`, { method: "DELETE" });
      deleted++;
    }
    console.log(`PR #${n}: deleted ${prDeploys.length} deploy(s).`);
  }
  console.log(`✓ Deleted ${deleted} deploy(s).`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
