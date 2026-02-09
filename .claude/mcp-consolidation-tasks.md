# MCP Server Consolidation Tasks

This file tracks progress on consolidating the NYSDS MCP server tools from 18 to 9 tools.

## Summary

| Before | After | Reduction |
|--------|-------|-----------|
| 18 tools | 9 tools | 50% |

## Final Tool Inventory

| Tool | Description |
|------|-------------|
| `find_components` | Search or list all components (query optional) |
| `get_component` | Full docs for a specific component |
| `validate_component_api` | Validate component attribute/property usage |
| `get_tokens` | Get tokens, categories, or themes |
| `find_tokens` | Search tokens by name/value/description |
| `get_token_info` | Detailed token info with optional context validation |
| `get_token_graph` | Token dependency visualization |
| `get_utility_classes` | Utility class reference |
| `get_guide` | Consolidated guides (installation, forms, styles, fonts, page structure, framework) |

## Completed Tasks

### Task 1: Consolidate 5 guide tools into single get_guide tool ✅
- Created `data/guides/*.md` files for each guide topic
- Created `data/guides/frameworks/*.md` for framework-specific guides
- Created `src/tools/guide-tools.ts` with consolidated `get_guide` tool
- Removed guide tools from component-tools.ts, validation-tools.ts, utility-tools.ts
- Updated `tools/index.ts` to import guide-tools.ts

### Task 2: Merge list_components into find_components ✅
- Made `query` parameter optional in `find_components`
- When query is omitted/empty, returns all components
- Removed `list_components` tool

### Task 3: Consolidate token metadata tools into get_tokens ✅
- Added `output` parameter with enum: "tokens" (default), "categories", "themes"
- Renamed tool from `get_design_tokens` to `get_tokens`
- Removed standalone `list_token_categories` and `list_themes` tools

### Task 4: Merge get_token_value and validate_token_usage into get_token_info ✅
- Created `get_token_info` tool with optional `context` parameter
- When context provided, includes validation recommendations
- Removed the two separate tools

### Task 5: Reduce response verbosity with JSON replacer ✅
- Created `lib/format.ts` with `formatResponse()` utility
- Applied to all token tool responses
- Reduced `get_token_graph` default limit from 50 to 20

### Task 6: Standardize tool naming conventions ✅
- Renamed `get_component_docs` → `get_component`
- Renamed `get_design_tokens` → `get_tokens`

### Task 7: Add resource URIs to tool responses ✅
- Added `resourceUri` field to component responses
- Added `resourceUri` field to token info response

### Task 8: Update nysds_mode prompt with consolidated tool names ✅
- Updated `prompts/nysds-mode.ts` with new tool set
- Removed references to deprecated tools

### Task 9: Test consolidated MCP server ✅
- Build succeeds: `npm run build --workspace=packages/mcp-server`
- Server module loads correctly
- 9 tools registered (down from 18)

## Files Modified

- `src/tools/index.ts` - Added guide-tools import
- `src/tools/component-tools.ts` - Merged list into find, renamed get_component_docs, added resourceUri
- `src/tools/validation-tools.ts` - Removed guide tools
- `src/tools/utility-tools.ts` - Removed guide tools
- `src/tools/token-tools.ts` - Consolidated tools, added formatResponse, added resourceUri
- `src/tools/guide-tools.ts` - NEW: Consolidated guide tool
- `src/lib/format.ts` - NEW: Response formatting utilities
- `src/prompts/nysds-mode.ts` - Updated tool list
- `data/guides/*.md` - NEW: Guide markdown files
- `data/guides/frameworks/*.md` - NEW: Framework-specific guides

## Status: COMPLETE ✅

All consolidation tasks completed. The MCP server now has 9 tools instead of 18 (50% reduction).
