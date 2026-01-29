# CLAUDE.md

This file provides guidance for contributors working with code in this repository.

## Build and Development Commands

```bash
# Build the project (uses esbuild)
npm run build

# Run in development mode with ts-node (requires Node.js 18+)
npm run dev

# Start the built server
npm run start

# Watch mode for TypeScript compilation
npm run watch

# Test with MCP Inspector UI (opens client on port 5173, server on port 3000)
npm run inspector

# Use custom ports if defaults are taken
CLIENT_PORT=5009 SERVER_PORT=3009 npm run inspector
```

## Node.js Version Requirements

- **Node.js 18+**: Required for development and MCP Inspector
- **Build/Start**: Works on all modern Node.js versions (18+)

Use `nvm` to switch versions: `nvm use 20`

## Environment Variables

- `ASANA_ACCESS_TOKEN` - Required. Your Asana personal access token
- `READ_ONLY_MODE` - Optional. Set to `'true'` to disable all write operations

## Architecture

This is an enhanced MCP (Model Context Protocol) server that exposes comprehensive Asana functionality to AI assistants. It includes advanced batch operations, direct section assignment, and enterprise-grade reliability features.

### Core Components

- **`src/index.ts`** - Entry point. Creates the MCP Server instance, initializes the Asana client, registers all handlers, and implements selective tool activation
- **`src/asana-client-wrapper.ts`** - Wraps the `asana` npm package, providing typed methods for all Asana API operations with enhanced error handling
- **`src/tool-handler.ts`** - Defines the `list_of_tools` array, `READ_ONLY_TOOLS` array, and the main `tool_handler` function that routes tool calls with HTML validation and error isolation
- **`src/prompt-handler.ts`** - Defines MCP prompts (task-summary, task-completeness, create-task) with filtered read-only mode support
- **`src/resource-handler.ts`** - Exposes Asana workspaces and projects as MCP resources (readable via `asana://workspace/{gid}` and `asana://project/{gid}` URIs)
- **`src/asana-validate-xml.ts`** - Validates HTML/XML content for Asana's `html_notes` and `html_text` fields with detailed error reporting

### Tool Organization

Tools are organized by functional categories for efficient workflow management:

#### **Workspace Tools** (`src/tools/workspace-tools.ts`)

- `asana_list_workspaces` - List all available workspaces

#### **Project Tools** (`src/tools/project-tools.ts`)

- `asana_search_projects` - Search for projects using name patterns
- `asana_get_project` - Get detailed project information
- `asana_get_project_task_counts` - Get task counts for projects
- `asana_get_project_sections` - Get project sections
- `asana_create_project` - Create new projects

#### **Project Status Tools** (`src/tools/project-status-tools.ts`)

- `asana_get_project_status` - Get project status updates
- `asana_get_project_statuses` - Get all status updates for a project
- `asana_create_project_status` - Create new status updates
- `asana_delete_project_status` - Delete status updates

#### **Task Tools** (`src/tools/task-tools.ts`)

- `asana_search_tasks` - Advanced task search with 25+ filter options
- `asana_get_task` - Get detailed task information
- `asana_create_task` - Create new tasks with direct section assignment
- `asana_create_task_with_subtasks` - Create tasks with subtasks in one operation
- `asana_update_task` - Update existing tasks
- `asana_delete_task` - Delete tasks permanently
- `asana_get_multiple_tasks_by_gid` - Batch retrieve multiple tasks
- `asana_add_project_to_task` - Add tasks to projects
- `asana_remove_project_from_task` - Remove tasks from projects

#### **Subtask Tools** (`src/tools/task-tools.ts`)

- `asana_create_subtask` - Create individual subtasks

#### **Batch Operation Tools** (`src/tools/task-tools.ts`)

- `asana_batch_create_tasks` - Create multiple tasks in batch
- `asana_batch_update_tasks` - Update multiple tasks in batch
- `asana_batch_create_subtasks` - Create multiple subtasks in batch
- `asana_batch_delete_tasks` - Delete multiple tasks in batch
- `asana_batch_create_tasks_with_subtasks` - Create tasks with subtasks in batch

#### **Dependency Tools** (`src/tools/task-relationship-tools.ts`)

- `asana_add_task_dependencies` - Set task dependencies
- `asana_add_task_dependents` - Set task dependents
- `asana_set_parent_for_task` - Set parent-child relationships

#### **Story/Comment Tools** (`src/tools/story-tools.ts`)

- `asana_get_task_stories` - Get task comments and stories
- `asana_create_task_story` - Create comments with HTML support

#### **Tag Management Tools** (`src/tools/tag-tools.ts`)

- `asana_get_tag` - Get tag details
- `asana_get_tags_for_task` - Get task tags
- `asana_get_tags_for_workspace` - Get workspace tags
- `asana_update_tag` - Update tag properties
- `asana_delete_tag` - Delete tags
- `asana_get_tasks_for_tag` - Find tasks by tag
- `asana_create_tag_for_workspace` - Create new tags
- `asana_add_tag_to_task` - Tag tasks
- `asana_remove_tag_from_task` - Remove task tags

#### **Section Management Tools** (`src/tools/section-tools.ts`)

- `asana_section_operations` - Batch create/update/delete project sections

Each tool file exports `Tool` objects with `name`, `description`, and `inputSchema` following the MCP SDK types.

## Adding a New Tool - Checklist

When adding a new tool, ensure you complete ALL of these steps:

1. **Define the tool** in `src/tools/<category>-tools.ts`:
   - Export a `Tool` object with `name`, `description`, `inputSchema`
   - Use `asana_` prefix for the tool name
   - Include comprehensive parameter descriptions

2. **Add API method** in `src/asana-client-wrapper.ts`:
   - Add the method that calls the Asana SDK
   - Include proper error handling and type annotations

3. **Register the tool** in `src/tool-handler.ts`:
   - Import the tool from the tools file
   - Add to `all_tools` array
   - **If it's a READ-ONLY tool**: Add tool name to `READ_ONLY_TOOLS` array
   - Add the `case` handler in the switch statement with HTML validation

4. **Add to tool categories** in `src/index.ts`:
   - Add to appropriate `TOOL_CATEGORIES` group
   - Update `TOOL_REGISTRY` with tool reference

5. **Update documentation** in `README.md`:
   - Add tool to the appropriate category section
   - Include all parameters with descriptions and requirements

6. **Test the tool**:
   - Build: `npm run build`
   - Test using the MCP Inspector
   - Verify HTML validation works for applicable parameters

### Read-Only Mode

When `READ_ONLY_MODE=true`:

- Only tools listed in `READ_ONLY_TOOLS` array are available
- Write tool calls return an error with clear messaging
- The `create-task` prompt is automatically filtered out

**Important**: When adding a new read-only tool, you MUST add its name to the `READ_ONLY_TOOLS` array in `tool-handler.ts`.

## Testing

### Using the Test Helper Script

Source the helper script to get testing functions:

```bash
source scripts/test-mcp.sh

# List all available tools
mcp_list_tools

# Call a tool and get JSON result
mcp_call asana_list_workspaces '{}'

# Call a tool and parse the result
mcp_call_json asana_search_tasks '{"workspace":"YOUR_WORKSPACE_GID","completed":false}'

# Test a tool with expected result
mcp_test asana_list_workspaces '{}' 'length > 0'

# Run tag operations test suite
mcp_test_tags YOUR_WORKSPACE_GID

# Health check
mcp_health_check
```

### Manual Testing via JSON-RPC

MCP servers communicate via JSON-RPC 2.0 over stdio. You can test manually:

```bash
# Build first
npm run build

# Send JSON-RPC messages (requires jq)
echo '{"jsonrpc":"2.0","method":"initialize","id":0,"params":{"capabilities":{},"clientInfo":{"name":"test","version":"1.0"},"protocolVersion":"2024-11-05"}}' | node dist/index.js 2>/dev/null
```

## Common Issues

### Asana API Parameter Naming

The Asana API uses **dot notation** for filter parameters (e.g., `assignee.any`, `sections.all`), but MCP tool schemas use **underscore notation** (e.g., `assignee_any`, `sections_all`) for JSON compatibility.

The `searchTasks` method in `asana-client-wrapper.ts` automatically maps underscore parameters to dot notation. If adding new search parameters, ensure they're included in the `keyMappings` object.

### Search Returns Too Many Results

If search filters appear to be ignored:

1. Check the parameter is in the `keyMappings` object in `searchTasks()`
2. Verify the parameter name matches the Asana API documentation
3. Test with an impossible filter value to confirm filtering is working

### HTML Validation Errors

When tools fail with HTML validation errors:

1. Ensure HTML tags are properly closed and nested
2. Check that only supported Asana HTML tags are used
3. Use plain text for `notes` if HTML validation continues to fail
4. Review the detailed validation error messages for specific issues

## Build System

Uses esbuild (`build.js`) to bundle TypeScript into a single ESM file. The version is injected at build time from `package.json` via `__VERSION__` define.
