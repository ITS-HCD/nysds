#!/usr/bin/env bash
# WS0 task 0.1/0.2 helper: copy prior-art reference files out of the two
# abandoned framework branches using read-only `git show`. Run from the
# repository root. Safe to re-run; it overwrites the copies.
set -euo pipefail

DEST="plans/framework-support/prior-art"
ANG_BRANCH="origin/feature/angular-support"
ANG_SHA="c5b792b2"
ANG_DATE="2026-06-15"
ENH_BRANCH="origin/enhancement/react-angular-implementation"

mkdir -p "$DEST/angular-support/shared" "$DEST/angular-support/form"

# --- PRDFRAMEWORKS.md (task 0.1.2): header written separately; append source.
git show "$ENH_BRANCH:PRDFRAMEWORKS.md" >> "$DEST/PRDFRAMEWORKS.md"

# --- Angular reference files (task 0.2), each with a provenance header.
ts_header() {
  local path="$1"
  cat <<EOF
/*
 * Prior art: read-only reference for WS4. Not compiled, not imported.
 * Source: ITS-HCD/nysds branch feature/angular-support (commit $ANG_SHA, $ANG_DATE)
 * Original path: $path
 * Copied by WS0 (plans/framework-support/00-hygiene-and-foundations.md, task 0.2).
 */
EOF
}

copy_ts() {
  local src="$1" dest="$2"
  { ts_header "$src"; git show "$ANG_BRANCH:$src"; } > "$dest"
}

copy_ts packages/angular/src/lib/shared/nys-control-value-accessor.base.ts \
  "$DEST/angular-support/shared/nys-control-value-accessor.base.ts"
copy_ts packages/angular/src/lib/shared/nys-event.types.ts \
  "$DEST/angular-support/shared/nys-event.types.ts"

# The brief names these form/*.directive.ts; on the branch they are
# form/*.component.ts. Copy what exists.
for f in $(git ls-tree -r --name-only "$ANG_BRANCH" packages/angular/src/lib/form); do
  copy_ts "$f" "$DEST/angular-support/form/$(basename "$f")"
done

copy_ts packages/angular/integration-test/tests/smoke.spec.ts \
  "$DEST/angular-support/smoke.spec.ts"

{
  cat <<EOF
> **Provenance:** read-only reference for WS4. Copied from
> \`packages/angular/README.md\` on the \`feature/angular-support\` branch
> (commit $ANG_SHA, $ANG_DATE) by WS0
> (\`plans/framework-support/00-hygiene-and-foundations.md\`, task 0.2).

EOF
  git show "$ANG_BRANCH:packages/angular/README.md"
} > "$DEST/angular-support/README.md"

echo "done"
