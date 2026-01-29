#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { VERSION } from "./version.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tool_handler, list_of_tools } from "./tool-handler.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { AsanaClientWrapper } from "./asana-client-wrapper.js";
import { createPromptHandlers } from "./prompt-handler.js";
import { createResourceHandlers } from "./resource-handler.js";
import { listWorkspacesTool } from "./tools/workspace-tools.js";
import {
  searchProjectsTool,
  getProjectTool,
  getProjectTaskCountsTool,
  getProjectSectionsTool,
  createProjectTool,
} from "./tools/project-tools.js";
import {
  getProjectStatusTool,
  getProjectStatusesForProjectTool,
  createProjectStatusTool,
  deleteProjectStatusTool,
} from "./tools/project-status-tools.js";
import {
  searchTasksTool,
  getTaskTool,
  createTaskTool,
  updateTaskTool,
  createSubtaskTool,
  getMultipleTasksByGidTool,
  addProjectToTaskTool,
  removeProjectFromTaskTool,
  deleteTaskTool,
  batchCreateTasksTool,
  batchUpdateTasksTool,
  batchCreateSubtasksTool,
  batchDeleteTasksTool,
  createTaskWithSubtasksTool,
  batchCreateTasksWithSubtasksTool,
} from "./tools/task-tools.js";
import {
  getTagTool,
  getTagsForTaskTool,
  getTagsForWorkspaceTool,
  updateTagTool,
  deleteTagTool,
  getTasksForTagTool,
  createTagForWorkspaceTool,
  addTagToTaskTool,
  removeTagFromTaskTool,
} from "./tools/tag-tools.js";
import {
  addTaskDependenciesTool,
  addTaskDependentsTool,
  setParentForTaskTool,
} from "./tools/task-relationship-tools.js";
import {
  getStoriesForTaskTool,
  createTaskStoryTool,
} from "./tools/story-tools.js";
import { sectionOperationsTool } from "./tools/section-tools.js";

// Global variables for selective tool activation
export let enabledToolCategories: string[] = [];
export let enabledTools: string[] = [];

// Function to parse command line arguments for selective tool activation
function parseArguments() {
  const args = process.argv.slice(2);
  let parsingEnabledToolCategories = false;
  let parsingEnabledTools = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--enabled-tool-categories") {
      parsingEnabledToolCategories = true;
      parsingEnabledTools = false;

      // Look ahead to collect all non-flag arguments
      const categories: string[] = [];
      while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        categories.push(args[i + 1]);
        i++;
      }

      // Also support comma-separated format for backward compatibility
      enabledToolCategories = categories.flatMap((c) =>
        c
          .split(",")
          .map((cat) => cat.trim())
          .filter((cat) => cat.length > 0),
      );

      continue;
    }

    if (arg === "--enabled-tools") {
      parsingEnabledTools = true;
      parsingEnabledToolCategories = false;

      // Look ahead to collect all non-flag arguments
      const tools: string[] = [];
      while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        tools.push(args[i + 1]);
        i++;
      }

      // Also support comma-separated format for backward compatibility
      enabledTools = tools.flatMap((t) =>
        t
          .split(",")
          .map((tool) => tool.trim())
          .filter((tool) => tool.length > 0),
      );

      continue;
    }

    if (arg === "--help" || arg === "-h") {
      console.error("Usage: node dist/index.js [options]");
      console.error("");
      console.error("Options:");
      console.error(
        "  --enabled-tool-categories <cats...>  Enable specific tool categories (comma-separated or space-separated)",
      );
      console.error(
        "  --enabled-tools <tools...>      Enable specific tools (comma-separated or space-separated)",
      );
      console.error(
        "  --help, -h                         Show this help message",
      );
      console.error("");
      console.error("Tool Categories:");
      console.error("  workspaces    - Workspace management tools");
      console.error("  projects      - Project management tools");
      console.error("  project-status - Project status update tools");
      console.error("  tasks         - Individual task management tools");
      console.error("  subtasks      - Subtask creation tools");
      console.error("  batch         - Batch operation tools");
      console.error("  dependencies  - Task dependency tools");
      console.error("  stories       - Task story/comment tools");
      console.error("  tags          - Tag management tools");
      console.error("  all           - All tools (default)");
      console.error("");
      console.error("Examples:");
      console.error(
        "  node dist/index.js --enabled-tool-categories tasks batch",
      );
      console.error(
        "  node dist/index.js --enabled-tools asana_create_task,asana_search_tasks",
      );
      process.exit(0);
    }
  }
}

// Tool registry for selective activation
const TOOL_REGISTRY = {
  // Workspace tools
  asana_list_workspaces: () => listWorkspacesTool,

  // Project tools
  asana_search_projects: () => searchProjectsTool,
  asana_get_project: () => getProjectTool,
  asana_get_project_task_counts: () => getProjectTaskCountsTool,
  asana_get_project_sections: () => getProjectSectionsTool,
  asana_create_project: () => createProjectTool,

  // Project status tools
  asana_get_project_status: () => getProjectStatusTool,
  asana_get_project_statuses: () => getProjectStatusesForProjectTool,
  asana_create_project_status: () => createProjectStatusTool,
  asana_delete_project_status: () => deleteProjectStatusTool,

  // Task tools
  asana_search_tasks: () => searchTasksTool,
  asana_get_task: () => getTaskTool,
  asana_create_task: () => createTaskTool,
  asana_create_task_with_subtasks: () => createTaskWithSubtasksTool,
  asana_update_task: () => updateTaskTool,
  asana_delete_task: () => deleteTaskTool,
  asana_get_multiple_tasks_by_gid: () => getMultipleTasksByGidTool,
  asana_add_project_to_task: () => addProjectToTaskTool,
  asana_remove_project_from_task: () => removeProjectFromTaskTool,

  // Subtask tools
  asana_create_subtask: () => createSubtaskTool,

  // Batch tools
  asana_batch_create_tasks: () => batchCreateTasksTool,
  asana_batch_update_tasks: () => batchUpdateTasksTool,
  asana_batch_create_subtasks: () => batchCreateSubtasksTool,
  asana_batch_delete_tasks: () => batchDeleteTasksTool,
  asana_batch_create_tasks_with_subtasks: () =>
    batchCreateTasksWithSubtasksTool,

  // Dependency tools
  asana_add_task_dependencies: () => addTaskDependenciesTool,
  asana_add_task_dependents: () => addTaskDependentsTool,
  asana_set_parent_for_task: () => setParentForTaskTool,

  // Story tools
  asana_get_task_stories: () => getStoriesForTaskTool,
  asana_create_task_story: () => createTaskStoryTool,

  // Tag tools
  asana_get_tag: () => getTagTool,
  asana_get_tags_for_task: () => getTagsForTaskTool,
  asana_get_tags_for_workspace: () => getTagsForWorkspaceTool,
  asana_update_tag: () => updateTagTool,
  asana_delete_tag: () => deleteTagTool,
  asana_get_tasks_for_tag: () => getTasksForTagTool,
  asana_create_tag_for_workspace: () => createTagForWorkspaceTool,
  asana_add_tag_to_task: () => addTagToTaskTool,
  asana_remove_tag_from_task: () => removeTagFromTaskTool,

  // Section tools
  asana_section_operations: () => sectionOperationsTool,
};

// Tool categories for easier configuration
const TOOL_CATEGORIES = {
  workspaces: ["asana_list_workspaces"],
  projects: [
    "asana_search_projects",
    "asana_get_project",
    "asana_get_project_task_counts",
    "asana_get_project_sections",
    "asana_create_project",
  ],
  "project-status": [
    "asana_get_project_status",
    "asana_get_project_statuses",
    "asana_create_project_status",
    "asana_delete_project_status",
  ],
  tasks: [
    "asana_search_tasks",
    "asana_get_task",
    "asana_create_task",
    "asana_create_task_with_subtasks",
    "asana_update_task",
    "asana_delete_task",
    "asana_get_multiple_tasks_by_gid",
    "asana_add_project_to_task",
    "asana_remove_project_from_task",
  ],
  subtasks: ["asana_create_subtask"],
  batch: [
    "asana_batch_create_tasks",
    "asana_batch_update_tasks",
    "asana_batch_create_subtasks",
    "asana_batch_delete_tasks",
    "asana_batch_create_tasks_with_subtasks",
  ],
  dependencies: [
    "asana_add_task_dependencies",
    "asana_add_task_dependents",
    "asana_set_parent_for_task",
  ],
  stories: ["asana_get_task_stories", "asana_create_task_story"],
  tags: [
    "asana_get_tag",
    "asana_get_tags_for_task",
    "asana_get_tags_for_workspace",
    "asana_update_tag",
    "asana_delete_tag",
    "asana_get_tasks_for_tag",
    "asana_create_tag_for_workspace",
    "asana_add_tag_to_task",
    "asana_remove_tag_from_task",
  ],
  sections: ["asana_section_operations"],
  all: [
    "asana_list_workspaces",
    "asana_search_projects",
    "asana_get_project",
    "asana_get_project_task_counts",
    "asana_get_project_sections",
    "asana_create_project",
    "asana_get_project_status",
    "asana_get_project_statuses",
    "asana_create_project_status",
    "asana_delete_project_status",
    "asana_search_tasks",
    "asana_get_task",
    "asana_create_task",
    "asana_create_task_with_subtasks",
    "asana_update_task",
    "asana_delete_task",
    "asana_get_multiple_tasks_by_gid",
    "asana_add_project_to_task",
    "asana_remove_project_from_task",
    "asana_create_subtask",
    "asana_batch_create_tasks",
    "asana_batch_update_tasks",
    "asana_batch_create_subtasks",
    "asana_batch_delete_tasks",
    "asana_batch_create_tasks_with_subtasks",
    "asana_add_task_dependencies",
    "asana_add_task_dependents",
    "asana_set_parent_for_task",
    "asana_get_task_stories",
    "asana_create_task_story",
    "asana_get_tag",
    "asana_get_tags_for_task",
    "asana_get_tags_for_workspace",
    "asana_update_tag",
    "asana_delete_tag",
    "asana_get_tasks_for_tag",
    "asana_create_tag_for_workspace",
    "asana_add_tag_to_task",
    "asana_remove_tag_from_task",
    "asana_section_operations",
  ],
};

// Function to expand tool categories and validate tool names
function expandEnabledTools(requestedTools: string[]): string[] {
  const expandedTools = new Set<string>();

  for (const tool of requestedTools) {
    if (tool === "all") {
      // Add all tools
      TOOL_CATEGORIES.all.forEach((t) => expandedTools.add(t));
    } else if (TOOL_CATEGORIES[tool as keyof typeof TOOL_CATEGORIES]) {
      // Expand category
      (
        TOOL_CATEGORIES[tool as keyof typeof TOOL_CATEGORIES] as string[]
      ).forEach((t) => expandedTools.add(t));
    } else if (TOOL_REGISTRY[tool as keyof typeof TOOL_REGISTRY]) {
      // Individual tool
      expandedTools.add(tool);
    } else {
      console.warn(`Unknown tool or category: ${tool}`);
    }
  }

  return Array.from(expandedTools);
}

// Function to combine and validate enabled tools from both categories and individual tools
export function combineEnabledTools(): string[] {
  const allRequestedTools = [...enabledToolCategories, ...enabledTools];

  if (allRequestedTools.length === 0) {
    // If no tools specified, enable all by default
    return TOOL_CATEGORIES.all;
  }

  return expandEnabledTools(allRequestedTools);
}

async function main() {
  // Parse command line arguments for selective tool activation
  parseArguments();

  const asanaToken = process.env.ASANA_ACCESS_TOKEN;

  if (!asanaToken) {
    console.error("Please set ASANA_ACCESS_TOKEN environment variable");
    process.exit(1);
  }

  console.error("Starting Asana MCP Server...");
  const server = new Server(
    {
      name: "Asana MCP Server",
      version: VERSION,
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
        resources: {},
      },
    },
  );

  const asanaClient = new AsanaClientWrapper(asanaToken);

  server.setRequestHandler(CallToolRequestSchema, tool_handler(asanaClient));

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    let tools = list_of_tools;

    // Filter tools if selective activation is configured
    if (enabledToolCategories.length > 0 || enabledTools.length > 0) {
      const combinedEnabledTools = combineEnabledTools();
      tools = tools.filter((tool) => combinedEnabledTools.includes(tool.name));
      console.error(
        `Filtered to ${tools.length} tools: ${tools.map((t) => t.name).join(", ")}`,
      );
    }

    return {
      tools,
    };
  });

  const promptHandlers = createPromptHandlers(asanaClient);

  // Add prompt handlers
  server.setRequestHandler(
    ListPromptsRequestSchema,
    promptHandlers.listPrompts,
  );
  server.setRequestHandler(GetPromptRequestSchema, promptHandlers.getPrompt);

  // Add resource handlers
  const resourceHandlers = createResourceHandlers(asanaClient);
  server.setRequestHandler(
    ListResourcesRequestSchema,
    resourceHandlers.listResources,
  );
  server.setRequestHandler(
    ListResourceTemplatesRequestSchema,
    resourceHandlers.listResourceTemplates,
  );
  server.setRequestHandler(
    ReadResourceRequestSchema,
    resourceHandlers.readResource,
  );

  const transport = new StdioServerTransport();
  console.error("Connecting server to transport...");
  await server.connect(transport);

  console.error("Asana MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
