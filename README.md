# Asana Project Ops MCP Server

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
[![MCP Server](https://badge.mcpx.dev?type=server "MCP Server")](https://modelcontextprotocol.io)
[![MCP Server with Tools](https://badge.mcpx.dev?type=server&features=tools "MCP server with tools")](https://modelcontextprotocol.io)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Asana Project Ops** is a high-performance Model Context Protocol (MCP) server that transforms how AI assistants interact with Asana. Optimized for efficiency and speed through advanced batch operations following the best practices of [Vulcan File Ops MCP Server](https://github.com/n0zer0d4y/vulcan-file-ops) batch operations and selective tool activation.

This server is designed for project managers, developers, and anyone working on projects across any domain who need to manage complex task hierarchies without leaving their AI application. Unlike original single-operation approaches that become inefficient for hundreds of tasks (which AI agents actively discourage), Asana Project Ops enables seamless workflows from project brainstorming to task execution entirely within AI applications.

This is an enhanced fork of [roychri/mcp-server-asana](https://github.com/roychri/mcp-server-asana) with enterprise-grade optimizations and comprehensive batch capabilities.

## KEY New Features/Functionality

### **Advanced Batch Operations**

- **150-operation batch limits** designed to work within Asana's free tier rate limits (150 requests/minute)
- **Unified section management** with `asana_section_operations` (create/update/delete in single tool)
- **Complex task hierarchies** with `asana_batch_create_tasks_with_subtasks` (50 tasks × 50 subtasks each)

### **Direct Section Assignment**

- Tasks created directly in specific sections during creation (eliminates separate API calls)
- **Significant reduction** in API calls for sectioned workflows (from 2 calls per task to 1)
- Available across all task creation tools

### **Enterprise-Grade Reliability**

- **Enhanced error handling** with `continue_on_error` support
- **Comprehensive input validation** for all operations

### **Selective Tool Activation**

- Tool categories for focused workflows (workspaces, projects, tasks, batch, etc.)
- Security controls for restricting sensitive operations
- Performance optimization by limiting available tools

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Setup](#setup)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Security

Asana Project Ops implements enterprise-grade security measures designed for safe project management operations:

### Credential Protection

- **Environment Variable Only**: Asana access tokens are exclusively managed through environment variables, never logged or exposed in application output
- **No Token Persistence**: Tokens are not stored, cached, or persisted beyond the current session
- **Secure Transmission**: All API communications use HTTPS with Asana's official endpoints

### Operation Controls

- **Read-Only Mode**: Set `READ_ONLY_MODE=true` to disable all write operations, perfect for testing, audits, or restricted environments
- **Selective Tool Activation**: Configure which tools are available using `--enabled-tool-categories` or `--enabled-tools` to restrict capabilities based on user roles or compliance requirements
- **Batch Operation Safety**: All batch operations include `continue_on_error` support to prevent complete failures from individual item errors

### Content Security

- **HTML Validation**: Comprehensive validation of HTML content in task descriptions and comments prevents injection attacks while supporting Asana's allowed HTML tags
- **Input Sanitization**: All user inputs are validated and sanitized before API submission
- **Error Isolation**: Batch operations isolate errors per item, preventing cascade failures that could expose sensitive information

### Compliance Features

- **Audit Trail**: Clear error messages and operation logging for compliance monitoring
- **Rate Limit Awareness**: Built-in respect for Asana's API rate limits prevents accidental abuse
- **Access Control**: Tool-level restrictions enable role-based access control for different team members

## Background

### Project Origin

Asana Project Ops is an enhanced evolution of [roychri/mcp-server-asana](https://github.com/roychri/mcp-server-asana), a foundational MCP server for Asana API integration. While the original project provided essential connectivity, it was limited by single-operation workflows that couldn't scale to enterprise project management needs.

### The Problem Solved

Traditional project management with Asana often involves inefficient workflows:

- **Single-operation limitations**: Creating hundreds of tasks requires individual API calls
- **Context switching**: Users must leave AI applications for CSV imports or manual organization
- **Rate limit challenges**: Sequential operations hit API limits quickly
- **Manual organization**: Tasks created in default sections require separate reassignment calls

### Enterprise-Grade Solution

Asana Project Ops transforms these limitations into streamlined workflows:

- **Batch operations**: Create, update, and organize hundreds of tasks in single operations
- **Direct section assignment**: Tasks created exactly where they belong, eliminating reorganization steps
- **Intelligent rate limit management**: Optimized for Asana's free tier limits (150 requests/minute)
- **AI-native workflows**: Complete project lifecycles without leaving your AI application

### Technical Innovation

The server introduces several architectural improvements:

- **Unified section operations**: Single tool for create, update, and delete operations
- **Complex task hierarchies**: Support for nested subtasks with batch processing
- **Enhanced validation**: Comprehensive HTML content validation and error reporting
- **Selective tool activation**: Performance optimization through configurable tool sets

## Install

### Prerequisites

- Node.js 18+ (for development) or Node.js 22+ (for MCP Inspector)
- Valid Asana account with API access token

### Environment Setup

Create an Asana personal access token:

1. Visit [Asana Developer Console](https://app.asana.com/0/my-apps)
2. Generate a personal access token
3. Set environment variable: `ASANA_ACCESS_TOKEN=your_token_here`

### Installation Options

#### For Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "asana-project-ops": {
      "command": "npx",
      "args": ["-y", "@n0zer0d4y/asana-project-ops"],
      "env": {
        "ASANA_ACCESS_TOKEN": "your-asana-access-token"
      }
    }
  }
}
```

#### For Local Development/Cursor

1. Build the project:

```bash
npm run build
```

2. Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "asana-project-ops-local": {
      "command": "node",
      "args": ["/path/to/your/project/dist/index.js"],
      "env": {
        "ASANA_ACCESS_TOKEN": "your-asana-access-token"
      }
    }
  }
}
```

#### For Claude Code

```bash
claude mcp add asana-project-ops -e ASANA_ACCESS_TOKEN=<TOKEN> -- npx -y @n0zer0d4y/asana-project-ops
```

## Usage

Asana Project Ops enables seamless project management workflows entirely within your AI application. Activate specific tool categories or individual tools to optimize performance and focus on your current workflow.

### Environment Variables

- `ASANA_ACCESS_TOKEN`: (Required) Your Asana access token
- `READ_ONLY_MODE`: (Optional) Set to 'true' to disable all write operations. In this mode:
  - Tools that modify Asana data (create, update, delete) will be disabled
  - The `create-task` prompt will be disabled
  - Only read operations will be available
    This is useful for testing or when you want to ensure no changes can be made to your Asana workspace.

### Rate Limits

The Asana API enforces rate limits to ensure fair usage:

- **Free tier**: 150 requests per minute
- **Paid tier**: 1500 requests per minute
- **Concurrent requests**: 15 simultaneous POST/PUT/PATCH/DELETE operations

**Batch operations** use sequential processing, making them naturally compliant with rate limits. Each individual API call in a batch counts toward the rate limit (150 requests/minute for free tier). While batch tools support up to 150 operations per batch, smaller batches (10 operations) are recommended for optimal performance and to avoid rate limiting.

### Selective Tool Activation

You can control which tools are available to the AI assistant by configuring tool categories or specific tools in your MCP client configuration. This is useful for:

- Reducing cognitive load by limiting available tools
- Security by restricting access to sensitive operations
- Performance optimization by reducing tool count
- Focused workflows by enabling only relevant tools

#### Tool Categories

The following categories are available:

- `workspaces` - Workspace management tools
- `projects` - Project management tools
- `project-status` - Project status update tools
- `tasks` - Individual task management tools
- `subtasks` - Subtask creation tools
- `batch` - Batch operation tools (create, update, delete multiple items)
- `dependencies` - Task dependency tools
- `stories` - Task story/comment tools
- `tags` - Tag management tools
- `sections` - Section management tools
- `all` - All tools (default behavior)

#### Configuration Examples

**Enable only task-related tools:**

```json
{
  "mcpServers": {
    "asana-project-ops-local": {
      "command": "node",
      "args": [
        "/path/to/dist/index.js",
        "--enabled-tool-categories",
        "tasks,batch"
      ],
      "env": {
        "ASANA_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

**Enable specific tools:**

```json
{
  "mcpServers": {
    "asana-project-ops-local": {
      "command": "node",
      "args": [
        "/path/to/dist/index.js",
        "--enabled-tools",
        "asana_create_task,asana_update_task,asana_search_tasks"
      ],
      "env": {
        "ASANA_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

**Mixed configuration:**

```json
{
  "mcpServers": {
    "asana-project-ops-local": {
      "command": "node",
      "args": [
        "/path/to/dist/index.js",
        "--enabled-tool-categories",
        "projects",
        "--enabled-tools",
        "asana_create_task,asana_update_task"
      ],
      "env": {
        "ASANA_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

**Workflow-specific examples:**

**For batch operations and task management:**

```bash
# Enable task and batch operations for efficient project setup
--enabled-tool-categories "tasks,batch"
```

**For comprehensive project management:**

```bash
# Enable all project, section, and task management tools
--enabled-tool-categories "projects,tasks,batch"
```

**For specific workflows:**

```bash
# Enable only section operations and task creation
--enabled-tools "asana_section_operations,asana_create_task,asana_batch_create_tasks"
```

**Note**: If no `--enabled-tool-categories` or `--enabled-tools` are specified, all tools are enabled by default (backward compatible).

### Workflow Examples

For comprehensive end-to-end workflows covering project setup, task management, subtasks, and organization, see the **[Basic Workflow Guide](docs/BASIC-WORKFLOW-GUIDE.md)**.

**Quick Examples:**

**Project Setup Workflow:**

1. Activate batch operations: `--enabled-tool-categories "batch"`
2. Ask your AI agent: _"Create a new project called 'Q1 Product Launch' with sections for Planning, Development, Testing, and Deployment"_

**Task Creation Workflow:**

1. Activate task tools: `--enabled-tool-categories "tasks"`
2. Ask your AI agent: _"Create 20 user story tasks for the sprint backlog in the Development section, each with acceptance criteria as subtasks"_

**Section Organization Workflow:**

1. Activate section tools: `--enabled-tools "asana_section_operations"`
2. Ask your AI agent: _"Reorganize the project sections - move Testing before Deployment and rename Planning to 'Discovery'"_

**Bulk Task Management:**

1. Activate batch tools: `--enabled-tool-categories "batch"`
2. Ask your AI agent: _"Update all tasks in the Development section to have a due date of next Friday and add the 'high-priority' tag"_

### Efficiency Benefits

- **Zero Context Switching**: Complete project workflows without leaving your AI application
- **Batch Operations**: Create hundreds of tasks and subtasks in single operations
- **Direct Section Assignment**: Tasks created exactly where they belong, eliminating manual organization
- **Intelligent Tool Selection**: Mention "Asana" or specific operations to guide AI tool selection

The AI agent will automatically select the most appropriate tools based on your requests, leveraging the advanced batch capabilities for maximum efficiency.

## API

### Tools

Asana Project Ops provides comprehensive tool categorization for efficient workflow management. Tools are organized by functional categories to help you select the right capabilities for your specific needs.

#### **Tool Categories**

- `workspaces` - Workspace management tools
- `projects` - Project management tools
- `project-status` - Project status update tools
- `tasks` - Individual task management tools
- `subtasks` - Subtask creation tools
- `batch` - Batch operation tools (create, update, delete multiple items)
- `dependencies` - Task dependency tools
- `stories` - Task story/comment tools
- `tags` - Tag management tools
- `sections` - Section management tools
- `all` - All tools (default behavior)

### Tools Overview

#### [Workspace Tools](#workspace-tools)

- `asana_list_workspaces`

#### [Project Tools](#project-tools)

- `asana_search_projects`
- `asana_get_project`
- `asana_get_project_task_counts`
- `asana_get_project_sections`
- `asana_create_project`

#### [Project Status Tools](#project-status-tools)

- `asana_get_project_status`
- `asana_get_project_statuses`
- `asana_create_project_status`
- `asana_delete_project_status`

#### [Task Tools](#task-tools)

- `asana_search_tasks`
- `asana_get_task`
- `asana_create_task`
- `asana_create_task_with_subtasks`
- `asana_update_task`
- `asana_delete_task`
- `asana_get_multiple_tasks_by_gid`
- `asana_add_project_to_task`
- `asana_remove_project_from_task`

#### [Subtask Tools](#subtask-tools)

- `asana_create_subtask`

#### [Batch Operation Tools](#batch-operation-tools)

- `asana_batch_create_tasks`
- `asana_batch_update_tasks`
- `asana_batch_create_subtasks`
- `asana_batch_delete_tasks`
- `asana_batch_create_tasks_with_subtasks`

#### [Dependency Tools](#dependency-tools)

- `asana_add_task_dependencies`
- `asana_add_task_dependents`
- `asana_set_parent_for_task`

#### [Story/Comment Tools](#storycomment-tools)

- `asana_get_task_stories`
- `asana_create_task_story`

#### [Tag Management Tools](#tag-management-tools)

- `asana_get_tag`
- `asana_get_tags_for_task`
- `asana_get_tags_for_workspace`
- `asana_update_tag`
- `asana_delete_tag`
- `asana_get_tasks_for_tag`
- `asana_create_tag_for_workspace`
- `asana_add_tag_to_task`
- `asana_remove_tag_from_task`

#### [Section Management Tools](#section-management-tools)

- `asana_section_operations`

#### **Workspace Tools**

1. **`asana_list_workspaces`**
   - List all available workspaces in Asana
   - **Optional input:**
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** List of workspaces

#### **Project Tools**

2. **`asana_search_projects`**
   - Search for projects in Asana using name pattern matching
   - **Required input:**
     - `workspace` (string): The workspace to search in
     - `name_pattern` (string): Regular expression pattern to match project names
   - **Optional input:**
     - `archived` (boolean): Only return archived projects (default: false)
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** List of matching projects

3. **`asana_get_project`**
   - Get detailed information about a specific project
   - **Required input:**
     - `project_id` (string): The project ID to retrieve
   - **Optional input:**
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** Detailed project information

4. **`asana_get_project_task_counts`**
   - Get the number of tasks in a project
   - **Required input:**
     - `project_id` (string): The project ID to get task counts for
   - **Optional input:**
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** Task count information

5. **`asana_get_project_sections`**
   - Get sections in a project
   - **Required input:**
     - `project_id` (string): The project ID to get sections for
   - **Optional input:**
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** List of project sections

6. **`asana_create_project`**
   - Create a new project in a workspace or team
   - **Required input:**
     - `workspace` (string): The workspace GID to create the project in
     - `name` (string): Name of the project
   - **Optional input:**
     - `team` (string): The team GID (required for organization workspaces)
     - `notes` (string): Description or notes for the project
     - `color` (string): Color of the project (e.g., dark-pink, dark-green, light-blue)
     - `privacy_setting` (string): Privacy setting (public_to_workspace, private_to_team, private)
     - `default_view` (string): Default view (list, board, calendar, timeline)
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** The created project object

#### **Project Status Tools**

7. **`asana_get_project_status`**
   - Get a project status update
   - **Required input:**
     - `project_status_gid` (string): The project status GID to retrieve
   - **Optional input:**
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** Project status information

8. **`asana_get_project_statuses`**
   - Get all status updates for a project
   - **Required input:**
     - `project_gid` (string): The project GID to get statuses for
   - **Optional input:**
     - `limit` (number): Results per page (1-100)
     - `offset` (string): Pagination offset token
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** List of project status updates

9. **`asana_create_project_status`**
   - Create a new status update for a project
   - **Required input:**
     - `project_gid` (string): The project GID to create the status for
     - `text` (string): The text content of the status update
   - **Optional input:**
     - `color` (string): The color of the status (green, yellow, red)
     - `title` (string): The title of the status update
     - `html_text` (string): HTML formatted text for the status update
     - `opt_fields` (string): Comma-separated list of optional fields to include
   - **Returns:** Created project status information

10. **`asana_delete_project_status`**
    - Delete a project status update
    - **Required input:**
      - `project_status_gid` (string): The project status GID to delete
    - **Returns:** Deletion confirmation

#### **Task Tools**

11. **`asana_search_tasks`**

- Search tasks in a workspace with advanced filtering options
- **Optional input:**
  - `workspace` (string): The workspace to search in (optional)
  - `text` (string): Text to search for in task names and descriptions
  - `resource_subtype` (string): Filter by task subtype (e.g. milestone)
  - `completed` (boolean): Filter for completed tasks
  - `is_subtask` (boolean): Filter for subtasks
  - `has_attachment` (boolean): Filter for tasks with attachments
  - `is_blocked` (boolean): Filter for tasks with incomplete dependencies
  - `is_blocking` (boolean): Filter for incomplete tasks with dependents
  - `assignee`, `projects`, `sections`, `tags`, `teams`, and many other advanced filters
  - `sort_by` (string): Sort by due_date, created_at, completed_at, likes, modified_at (default: modified_at)
  - `sort_ascending` (boolean): Sort in ascending order (default: false)
  - `opt_fields` (string): Comma-separated list of optional fields to include
  - `custom_fields` (object): Object containing custom field filters
- **Returns:** List of matching tasks

12. **`asana_get_task`**

- Get detailed information about a specific task
- **Required input:**
  - `task_id` (string): The task ID to retrieve
- **Optional input:**
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** Detailed task information

13. **`asana_create_task`**

- Create a new task in a project
- **Required input:**
  - `project_id` (string): The project to create the task in
  - `name` (string): Name of the task
- **Optional input:**
  - `notes` (string): Description of the task
  - `html_notes` (string): HTML-like formatted description of the task
  - `due_on` (string): Due date in YYYY-MM-DD format
  - `assignee` (string): Assignee (can be 'me' or a user ID)
  - `followers` (array of strings): Array of user IDs to add as followers
  - `parent` (string): The parent task ID to set this task under
  - `projects` (array of strings): Array of project IDs to add this task to
  - `resource_subtype` (string): The type of the task (default_task, milestone, or approval)
  - `custom_fields` (object): Object mapping custom field GID strings to their values
  - `section` (string): Section GID to create the task in (task will be created directly in this section instead of the default section)
- **Returns:** Created task information

14. **`asana_create_task_with_subtasks`**

- Create any type of task (regular, milestone, approval) with optional subtasks in a single operation
- **Required input:**
  - `project_id` (string): Project to create the task in
  - `name` (string): Task name
- **Optional input:**
  - `notes` (string): Task description
  - `html_notes` (string): HTML-formatted description with @-mentions support
  - `due_on` (string): Due date in YYYY-MM-DD format
  - `assignee` (string): Assignee user identifier ("me", email, or user GID)
  - `followers` (array): Array of user IDs to add as followers
  - `resource_subtype` (string): Task type (default_task, milestone, approval)
  - `custom_fields` (object): Custom field values
  - `section` (string): Section GID to create the task in (task will be created directly in this section instead of the default section)
  - `subtasks` (array): Optional array of subtasks (max 50)
  - `continue_on_error` (boolean): Continue creating subtasks if main task creation fails (default: false)
- **Returns:** Complete task object with subtasks results and success/failure summary
- **Notes:** Universal replacement for task creation workflows. Maximum 50 subtasks per operation. Can create regular tasks or complex task hierarchies in one call.

15. **`asana_update_task`**

- Update an existing task's details
- **Required input:**
  - `task_id` (string): The task ID to update
- **Optional input:**
  - `name` (string): New name for the task
  - `notes` (string): New description for the task
  - `due_on` (string): New due date in YYYY-MM-DD format
  - `assignee` (string): New assignee (can be 'me' or a user ID)
  - `completed` (boolean): Mark task as completed or not
  - `resource_subtype` (string): The type of the task (default_task, milestone, or approval)
  - `custom_fields` (object): Object mapping custom field GID strings to their values
- **Returns:** Updated task information

16. **`asana_delete_task`**

- Delete a task permanently
- **Required input:**
  - `task_id` (string): The task ID to delete
- **Returns:** Success message confirming the task was deleted
- **Notes:** This action cannot be undone. The task will be permanently removed.

17. **`asana_get_multiple_tasks_by_gid`**

- Get detailed information about multiple tasks by their GIDs (maximum 25 tasks)
- **Required input:**
  - `task_ids` (array of strings or comma-separated string): Task GIDs to retrieve (max 25)
- **Optional input:**
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** List of detailed task information

18. **`asana_add_project_to_task`**

- Add an existing task to a project
- **Required input:**
  - `task_id` (string): The task ID to add to the project
  - `project_id` (string): The project ID to add the task to
- **Optional input:**
  - `section` (string): The section ID to add the task to within the project
  - `insert_after` (string): A task ID to insert this task after. At most one of insert_before, insert_after, or section should be specified.
  - `insert_before` (string): A task ID to insert this task before. At most one of insert_before, insert_after, or section should be specified.
- **Returns:** Success message confirming the task was added to the project
- **Notes:** If no positioning arguments are given, the task will be added to the end of the project

19. **`asana_remove_project_from_task`**

- Remove a task from a project
- **Required input:**
  - `task_id` (string): The task ID to remove from the project
  - `project_id` (string): The project ID to remove the task from
- **Returns:** Success message confirming the task was removed from the project
- **Notes:** The task will still exist in the system, but it will not be in the project anymore

#### **Subtask Tools**

20. **`asana_create_subtask`**

- Create a new subtask for an existing task
- **Required input:**
  - `parent_task_id` (string): The parent task ID to create the subtask under
  - `name` (string): Name of the subtask
- **Optional input:**
  - `notes` (string): Description of the subtask
  - `html_notes` (string): HTML-like formatted description of the subtask
  - `due_on` (string): Due date in YYYY-MM-DD format
  - `assignee` (string): Assignee (can be 'me' or a user ID)
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** Created subtask information

#### **Batch Operation Tools**

21. **`asana_batch_create_tasks`**

- Create multiple tasks in batch within the same project
- **Required input:**
  - `project_id` (string): The project to create tasks in
  - `tasks` (array): Array of task objects to create (max 150)
- **Optional input:**
  - `continue_on_error` (boolean): Continue processing if individual task creation fails (default: false)
- **Returns:** Array of results with success/failure status for each task
- **Notes:** Maximum 150 tasks per batch (10 recommended for optimal performance). Each task object supports the same properties as `asana_create_task`, including the optional `section` parameter for direct section assignment.

22. **`asana_batch_update_tasks`**

- Update multiple existing tasks in batch
- **Required input:**
  - `task_updates` (array): Array of task update objects (max 150)
- **Optional input:**
  - `continue_on_error` (boolean): Continue processing if individual task update fails (default: false)
- **Returns:** Array of results with success/failure status for each task update
- **Notes:** Maximum 150 tasks per batch (10 recommended for optimal performance). Each update object supports the same properties as `asana_update_task`.

23. **`asana_batch_create_subtasks`**

- Create multiple subtasks for existing parent tasks in batch
- **Required input:**
  - `subtasks` (array): Array of subtask objects to create (max 150)
- **Optional input:**
  - `continue_on_error` (boolean): Continue processing if individual subtask creation fails (default: false)
- **Returns:** Array of results with success/failure status for each subtask
- **Notes:** Maximum 150 subtasks per batch (10 recommended for optimal performance). Each subtask object supports the same properties as `asana_create_subtask`.

24. **`asana_batch_delete_tasks`**

- Delete multiple tasks in batch
- **Required input:**
  - `task_ids` (array): Array of task IDs to delete (max 150)
- **Optional input:**
  - `continue_on_error` (boolean): Continue processing if individual task deletion fails (default: false)
- **Returns:** Array of results with success/failure status for each task deletion
- **Notes:** Maximum 150 tasks per batch (10 recommended for optimal performance). This action cannot be undone.

25. **`asana_batch_create_tasks_with_subtasks`**

- Create multiple tasks with optional subtasks in batch within the same project
- **Required input:**
  - `project_id` (string): The project to create tasks in
  - `tasks` (array): Array of task objects to create (max 50)
- **Optional input:**
  - `continue_on_error` (boolean): Continue processing if individual task creation fails (default: false)
- **Returns:** Object with summary and array of results with success/failure status for each task and its subtasks
- **Notes:** Maximum 50 tasks per batch (10 recommended for optimal performance). Each task can have up to 50 subtasks. Supports direct section assignment via the optional `section` parameter in each task object. This tool consolidates the functionality of `asana_batch_create_tasks` and `asana_create_task_with_subtasks` into a single comprehensive operation.

#### **Dependency Tools**

26. **`asana_add_task_dependencies`**

- Set dependencies for a task
- **Required input:**
  - `task_id` (string): The task ID to add dependencies to
  - `dependencies` (array of strings): Array of task IDs that this task depends on
- **Returns:** Success response

27. **`asana_add_task_dependents`**

- Set dependents for a task (tasks that depend on this task)
- **Required input:**
  - `task_id` (string): The task ID to add dependents to
  - `dependents` (array of strings): Array of task IDs that depend on this task
- **Returns:** Success response

28. **`asana_set_parent_for_task`**

- Set the parent of a task and position the subtask within the other subtasks of that parent
- **Required input:**
  - `task_id` (string): The task ID to operate on
  - `data` (object):
    - `parent` (string): The new parent of the task, or null for no parent
- **Optional input:**
  - `insert_after` (string): A subtask of the parent to insert the task after, or null to insert at the beginning of the list
  - `insert_before` (string): A subtask of the parent to insert the task before, or null to insert at the end of the list
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** Updated task information

#### **Story/Comment Tools**

29. **`asana_get_task_stories`**

- Get comments and stories for a specific task
- **Required input:**
  - `task_id` (string): The task ID to get stories for
- **Optional input:**
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** List of task stories/comments

30. **`asana_create_task_story`**

- Create a comment or story on a task
- **Required input:**
  - `task_id` (string): The task ID to add the story to
- **Optional input:**
  - `text` (string): The plain text content of the story/comment
  - `html_text` (string): HTML-like formatted text for the comment
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** Created story information
- **Notes:** Either `text` or `html_text` is required, but not both

#### **Tag Management Tools**

31. **`asana_get_tag`**

- Get detailed information about a specific tag
- **Required input:**
  - `tag_gid` (string): Globally unique identifier for the tag
- **Optional input:**
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** Detailed tag information

32. **`asana_get_tags_for_task`**

- Get a task's tags
- **Required input:**
  - `task_gid` (string): The task to operate on
- **Optional input:**
  - `limit` (number): Results per page. The number of objects to return per page. The value must be between 1 and 100.
  - `offset` (string): Offset token. An offset to the next page returned by the API.
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** List of tags associated with the task

33. **`asana_get_tasks_for_tag`**

- Get tasks for a specific tag
- **Required input:**
  - `tag_gid` (string): The tag GID to retrieve tasks for
- **Optional input:**
  - `opt_fields` (string): Comma-separated list of optional fields to include
  - `opt_pretty` (boolean): Provides the response in a 'pretty' format
  - `limit` (integer): The number of objects to return per page. The value must be between 1 and 100.
  - `offset` (string): An offset to the next page returned by the API.
- **Returns:** List of tasks for the specified tag

34. **`asana_get_tags_for_workspace`**

- Get tags in a workspace
- **Required input:**
  - `workspace_gid` (string): Globally unique identifier for the workspace or organization
- **Optional input:**
  - `limit` (integer): Results per page. The number of objects to return per page. The value must be between 1 and 100.
  - `offset` (string): Offset token. An offset to the next page returned by the API.
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** List of tags in the workspace

35. **`asana_update_tag`**

- Update an existing tag
- **Required input:**
  - `tag_gid` (string): Globally unique identifier for the tag
- **Optional input:**
  - `name` (string): Name of the tag
  - `color` (string): Color of the tag. Can be one of: dark-pink, dark-green, dark-blue, dark-red, dark-teal, dark-brown, dark-orange, dark-purple, dark-warm-gray, light-pink, light-green, light-blue, light-red, light-teal, light-brown, light-orange, light-purple, light-warm-gray
  - `notes` (string): Notes about the tag
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** Updated tag information

36. **`asana_delete_tag`**

- Delete a tag
- **Required input:**
  - `tag_gid` (string): Globally unique identifier for the tag
- **Returns:** Deletion confirmation

37. **`asana_create_tag_for_workspace`**

- Create a new tag in a workspace
- **Required input:**
  - `workspace_gid` (string): Globally unique identifier for the workspace or organization
  - `name` (string): Name of the tag
- **Optional input:**
  - `followers` (array of strings): An array of strings identifying users. These can either be the string "me", an email, or the gid of a user.
  - `color` (string): Color of the tag. Can be one of: dark-pink, dark-green, dark-blue, dark-red, dark-teal, dark-brown, dark-orange, dark-purple, dark-warm-gray, light-pink, light-green, light-blue, light-red, light-teal, light-brown, light-orange, light-purple, light-warm-gray
  - `notes` (string): Notes about the tag
  - `opt_fields` (string): Comma-separated list of optional fields to include
- **Returns:** Created tag information

38. **`asana_add_tag_to_task`**

- Add a tag to a task
- **Required input:**
  - `task_gid` (string): The task GID to add the tag to
  - `tag_gid` (string): The tag GID to add to the task
- **Returns:** Success response

39. **`asana_remove_tag_from_task`**

- Remove a tag from a task
- **Required input:**
  - `task_gid` (string): The task GID to remove the tag from
  - `tag_gid` (string): The tag GID to remove from the task
- **Returns:** Success response

#### **Section Management Tools**

40. **`asana_section_operations`**

- Manage Asana project sections with create, update, and delete operations. Supports batch operations for efficient section management.
- **Required input:**
  - `operations` (array): List of section operations to perform (max 50)
    - Each operation object must include:
      - `operation` (string): Operation type ("create", "update", or "delete")
    - For "create" operations (required fields):
      - `project_gid` (string): Project GID where section will be created
      - `name` (string): Section name
      - `insert_before` (string, optional): Section GID to insert before
      - `insert_after` (string, optional): Section GID to insert after
    - For "update" operations (required fields):
      - `section_gid` (string): Section GID to update
      - `name` (string): New section name
    - For "delete" operations (required fields):
      - `section_gid` (string): Section GID to delete (must be empty)
- **Optional input:**
  - `continue_on_error` (boolean): Continue processing if individual operations fail (default: false)
- **Returns:** Operation results with summary showing total, successful, and failed operations, plus detailed results for each operation
- **Constraints:**
  - Delete operations require empty sections and cannot delete the last section in a project
  - Update operations can only modify section names (Asana API limitation)

## Prompts

1. `task-summary`
   - Get a summary and status update for a task based on its notes, custom fields and comments
   - Required input:
     - task_id (string): The task ID to get summary for
   - Returns: A detailed prompt with instructions for generating a task summary

2. `task-completeness`
   - Analyze if a task description contains all necessary details for completion
   - Required input:
     - task_id (string): The task ID or URL to analyze
   - Returns: A detailed prompt with instructions for analyzing task completeness

3. `create-task`
   - Create a new task with specified details
   - Required input:
     - project_name (string): The name of the Asana project where the task should be created
     - title (string): The title of the task
   - Optional input:
     - notes (string): Notes or description for the task
     - due_date (string): Due date for the task (YYYY-MM-DD format)
   - Returns: A detailed prompt with instructions for creating a comprehensive task

### Resources

1. Workspaces - `asana://workspace/{workspace_gid}`
   - Representation of Asana workspaces as resources
   - Each workspace is exposed as a separate resource
   - URI Format: `asana://workspace/{workspace_gid}`
   - Returns: JSON object with workspace details including:
     - `name`: Workspace name (string)
     - `id`: Workspace global ID (string)
     - `type`: Resource type (string)
     - `is_organization`: Whether the workspace is an organization (boolean)
     - `email_domains`: List of email domains associated with the workspace (string[])
   - Mime Type: `application/json`

2. Projects - `asana://project/{project_gid}`
   - Template resource for retrieving project details by GID
   - URI Format: `asana://project/{project_gid}`
   - Returns: JSON object with project details including:
     - `name`: Project name (string)
     - `id`: Project global ID (string)
     - `type`: Resource type (string)
     - `archived`: Whether the project is archived (boolean)
     - `public`: Whether the project is public (boolean)
     - `notes`: Project description/notes (string)
     - `color`: Project color (string)
     - `default_view`: Default view type (string)
     - `due_date`, `due_on`, `start_on`: Project date information (string)
     - `workspace`: Object containing workspace information
     - `team`: Object containing team information
     - `sections`: Array of section objects in the project
     - `custom_fields`: Array of custom field definitions for the project
   - Mime Type: `application/json`

## Setup

1. **Create an Asana account**:
   - Visit the [Asana](https://www.asana.com).
   - Click "Sign up".

2. **Retrieve the Asana Access Token**:
   - You can generate a personal access token from the Asana developer console.
     - https://app.asana.com/0/my-apps
   - More details here: https://developers.asana.com/docs/personal-access-token

3. **Installation Options**:

   ### For Claude Desktop:

   Add the following to your `claude_desktop_config.json`:

   ```json
   {
     "mcpServers": {
       "asana-project-ops": {
         "command": "npx",
         "args": ["-y", "@n0zer0d4y/asana-project-ops"],
         "env": {
           "ASANA_ACCESS_TOKEN": "your-asana-access-token"
         }
       }
     }
   }
   ```

   ### For Local Development/Testing in Cursor:

   First, build the project:

   ```bash
   npm run build
   ```

   Then add the following to your `claude_desktop_config.json` for local testing:

   ```json
   {
     "mcpServers": {
       "asana-project-ops-local": {
         "command": "node",
         "args": ["/path/to/your/project/dist/index.js"],
         "env": {
           "ASANA_ACCESS_TOKEN": "your-asana-access-token"
         }
       }
     }
   }
   ```

   **Note**: Use `asana-project-ops-local` as the server name to avoid conflicts with any production `asana-project-ops` server configuration. You must use the **full absolute path** to the `dist/index.js` file. The server will run from your local `dist/` directory.

   **Example for Windows:**

   ```json
   {
     "mcpServers": {
       "asana-project-ops-local": {
         "command": "node",
         "args": ["C:\\Path\\To\\Your\\Project\\dist\\index.js"],
         "env": {
           "ASANA_ACCESS_TOKEN": "your-asana-access-token"
         }
       }
     }
   }
   ```

   **To find the correct path:**
   1. Open a terminal in your project directory
   2. Run: `pwd` (Linux/Mac) or `cd` (Windows) to see the full path
   3. Append `\\dist\\index.js` (Windows) or `/dist/index.js` (Linux/Mac)

   ### For Claude Code:

   Use the following command to install and configure the MCP server:

   ```bash
   claude mcp add asana-project-ops -e ASANA_ACCESS_TOKEN=<TOKEN> -- npx -y @n0zer0d4y/asana-project-ops
   ```

   Replace `<TOKEN>` with your Asana access token.

If you want to install the beta version (not yet released), you can use:

- `@n0zer0d4y/asana-project-ops@beta`

You can find the current beta release, if any, with either:

1. https://www.npmjs.com/package/@n0zer0d4y/asana-project-ops?activeTab=versions
2. `npm dist-tag ls @n0zer0d4y/asana-project-ops`

## Troubleshooting

### Common Issues

#### Permission Errors

If you encounter permission errors:

1. Verify your Asana account has API access enabled (available on all plans including free tier)
2. Confirm your access token is correctly set in the `ASANA_ACCESS_TOKEN` environment variable
3. Check that your token has the necessary permissions for the operations you're attempting

#### Tool Not Found Errors

If tools aren't appearing in your AI application:

1. Restart your MCP client (Claude Desktop, Cursor, etc.) after configuration changes
2. Verify the server name in your configuration matches exactly
3. Check that the package is installed: `npm list @n0zer0d4y/asana-project-ops`
4. Ensure your Node.js version meets requirements (18+ for development, 22+ for MCP Inspector)

#### Batch Operation Failures

For issues with batch operations:

1. Reduce batch sizes if hitting rate limits (try batches of 10 instead of 150)
2. Check for `continue_on_error` support in your batch operation calls
3. Verify section GIDs exist when using direct section assignment
4. Review error messages for specific validation failures

#### HTML Content Issues

If task creation fails with HTML validation errors:

1. Ensure HTML tags are properly closed and nested
2. Check that only supported Asana HTML tags are used
3. Use plain text notes if HTML validation continues to fail
4. Review the specific error message for pinpointed issues

#### Rate Limiting

If you encounter rate limit errors:

1. Space out large batch operations
2. Use smaller batch sizes (10-50 operations recommended)
3. Wait between batch operations if needed
4. Consider upgrading to Asana's paid tier for higher limits (1500 requests/minute)

### Getting Help

- Check the [Asana Developer Documentation](https://developers.asana.com/docs) for API-specific issues
- Review the implementation plan documents in `docs/` for detailed feature explanations
- Test with the MCP Inspector: `npm run inspector`

## Contributing

We welcome contributions to enhance Asana Project Ops! This project focuses on improving efficiency and reliability for project management workflows.

### Development Setup

1. **Clone and Install**:

```bash
git clone https://github.com/n0zer0d4y/asana-project-ops.git
cd asana-project-ops
npm install
```

2. **Build the project**:

```bash
npm run build
```

3. **Test your changes** with the MCP Inspector:

```bash
npm run inspector
```

This exposes the client on port `5173` and server on port `3000`.

**Custom ports** (if defaults are occupied):

```bash
CLIENT_PORT=5009 SERVER_PORT=3009 npm run inspector
```

### Testing

#### MCP Inspector Testing

Use the MCP Inspector for interactive testing of tool functionality, especially batch operations and error handling.

#### CLI Testing

Source the test helper script for automated testing:

```bash
source scripts/test-mcp.sh
```

Available test commands:

```bash
mcp_list_tools                    # List all available tools
mcp_call asana_list_workspaces '{}'  # Test individual tools
mcp_test asana_list_workspaces '{}' 'length > 0'  # Run assertions
```

### Code Guidelines

#### Tool Development

- Follow the existing tool pattern in `src/tools/`
- Add comprehensive input validation
- Include error handling with actionable error messages
- Update both tool definitions and handler routing

#### Batch Operations

- Implement `continue_on_error` support for resilience
- Set appropriate maximum limits based on API constraints
- Provide clear progress feedback for large operations
- Test with various batch sizes (1, 10, 50, 150)

#### Documentation

- Update README.md tool descriptions for any new tools
- Add implementation plans to `docs/` for major features
- Include workflow examples in the Usage section
- Update CHANGELOG.md following professional standards

### Areas for Contribution

#### High Priority

- Additional batch operation tools
- Enhanced error recovery mechanisms
- Performance optimizations for large projects
- Integration with additional Asana features

#### Feature Requests

- Custom field bulk operations
- Advanced filtering and search capabilities
- Integration with external project management tools
- Mobile-optimized workflows

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Test** thoroughly with both MCP Inspector and CLI testing
4. **Update** documentation including README and CHANGELOG
5. **Submit** a pull request with a clear description of changes

All contributions should maintain backward compatibility and include comprehensive testing.

## License

Asana Project Ops is licensed under the MIT License. This permissive license allows you to freely use, modify, and distribute the software while maintaining the original copyright notice and license terms.

### Attribution

This project is an enhanced fork of [roychri/mcp-server-asana](https://github.com/roychri/mcp-server-asana), with substantial improvements including enterprise-grade batch operations, direct section assignment, and comprehensive error handling.

### Full License Text

For complete license terms and conditions, see the [LICENSE](LICENSE) file in this repository.

---

**Copyright (c) 2025 n0zer0d4y** - All rights reserved under MIT License terms.
