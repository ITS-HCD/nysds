/**
 * PR comment for the accessibility preview, used by actions/github-script in
 * .github/workflows/preview.yaml. One comment per PR, found by its marker and
 * updated in place on every push and when the PR closes.
 */
const fs = require("fs");

const MARKER = "<!-- nysds-preview -->";

/** Comment body after a build; previewUrl is empty when nothing was deployed. */
function deployedBody({ manifestPath, previewUrl, sha }) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  // The deploy's landing page links every review tool: the story list,
  // the visual regression report and the code review.
  const tools = previewUrl
    ? `**[Review tools](${previewUrl}/)**: [accessibility preview](${previewUrl}/preview/) · [visual regression](${previewUrl}/visual/) · [code review](${previewUrl}/code-review/)`
    : "";
  if (!manifest.pages.length) {
    return `${MARKER}
### Component preview

This PR changes no components with stories, so there are no story pages to test.${tools ? `\n\n${tools}` : ""}`;
  }
  const rows = manifest.components.map(
    (component) =>
      `| [${component.title}](${previewUrl}/${component.firstPath}/) | ${component.stories} | ${component.reason} |`,
  );
  return [
    MARKER,
    "### Component preview",
    "",
    tools,
    "",
    `**[Start testing](${previewUrl}/preview/)** — ${manifest.pages.length} stories, one per page. Use the bar at the bottom of each page to move to the previous or next story.`,
    "",
    "| Component | Stories | Why it's included |",
    "| --- | --- | --- |",
    ...rows,
    "",
    `Built from ${sha.slice(0, 7)}.`,
  ].join("\n");
}

function removedBody({ merged }) {
  return `${MARKER}
### Component preview

Preview removed: the PR was ${merged ? "merged" : "closed"}.`;
}

/** Creates or updates the preview comment. With createIfMissing false, only updates. */
async function upsertComment({
  github,
  context,
  body,
  createIfMissing = true,
}) {
  const { owner, repo } = context.repo;
  const issue_number = context.payload.pull_request.number;
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number,
    per_page: 100,
  });
  const existing = comments.find((comment) => comment.body?.includes(MARKER));
  if (existing) {
    await github.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body,
    });
  } else if (createIfMissing) {
    await github.rest.issues.createComment({ owner, repo, issue_number, body });
  }
}

module.exports = { deployedBody, removedBody, upsertComment };
