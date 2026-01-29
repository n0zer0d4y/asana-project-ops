import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const searchTasksTool: Tool = {
  name: "asana_search_tasks",
  description: "Search tasks in a workspace with advanced filtering options",
  inputSchema: {
    type: "object",
    properties: {
      workspace: {
        type: "string",
        description: "The workspace to search in",
      },
      text: {
        type: "string",
        description: "Text to search for in task names and descriptions",
      },
      resource_subtype: {
        type: "string",
        description: "Filter by task subtype (e.g. milestone)",
      },
      portfolios_any: {
        type: "string",
        description: "Comma-separated list of portfolio IDs",
      },
      assignee_any: {
        type: "string",
        description: "Comma-separated list of user IDs",
      },
      assignee_not: {
        type: "string",
        description: "Comma-separated list of user IDs to exclude",
      },
      projects_any: {
        type: "string",
        description: "Comma-separated list of project IDs",
      },
      projects_not: {
        type: "string",
        description: "Comma-separated list of project IDs to exclude",
      },
      projects_all: {
        type: "string",
        description: "Comma-separated list of project IDs that must all match",
      },
      sections_any: {
        type: "string",
        description: "Comma-separated list of section IDs",
      },
      sections_not: {
        type: "string",
        description: "Comma-separated list of section IDs to exclude",
      },
      sections_all: {
        type: "string",
        description: "Comma-separated list of section IDs that must all match",
      },
      tags_any: {
        type: "string",
        description: "Comma-separated list of tag IDs",
      },
      tags_not: {
        type: "string",
        description: "Comma-separated list of tag IDs to exclude",
      },
      tags_all: {
        type: "string",
        description: "Comma-separated list of tag IDs that must all match",
      },
      teams_any: {
        type: "string",
        description: "Comma-separated list of team IDs",
      },
      followers_not: {
        type: "string",
        description: "Comma-separated list of user IDs to exclude",
      },
      created_by_any: {
        type: "string",
        description: "Comma-separated list of user IDs",
      },
      created_by_not: {
        type: "string",
        description: "Comma-separated list of user IDs to exclude",
      },
      assigned_by_any: {
        type: "string",
        description: "Comma-separated list of user IDs",
      },
      assigned_by_not: {
        type: "string",
        description: "Comma-separated list of user IDs to exclude",
      },
      liked_by_not: {
        type: "string",
        description: "Comma-separated list of user IDs to exclude",
      },
      commented_on_by_not: {
        type: "string",
        description: "Comma-separated list of user IDs to exclude",
      },
      due_on: {
        type: "string",
        description: "ISO 8601 date string or null",
      },
      due_on_before: {
        type: "string",
        description: "ISO 8601 date string",
      },
      due_on_after: {
        type: "string",
        description: "ISO 8601 date string",
      },
      due_at_before: {
        type: "string",
        description: "ISO 8601 datetime string",
      },
      due_at_after: {
        type: "string",
        description: "ISO 8601 datetime string",
      },
      start_on: {
        type: "string",
        description: "ISO 8601 date string or null",
      },
      start_on_before: {
        type: "string",
        description: "ISO 8601 date string",
      },
      start_on_after: {
        type: "string",
        description: "ISO 8601 date string",
      },
      created_on: {
        type: "string",
        description: "ISO 8601 date string or null",
      },
      created_on_before: {
        type: "string",
        description: "ISO 8601 date string",
      },
      created_on_after: {
        type: "string",
        description: "ISO 8601 date string",
      },
      created_at_before: {
        type: "string",
        description: "ISO 8601 datetime string",
      },
      created_at_after: {
        type: "string",
        description: "ISO 8601 datetime string",
      },
      completed_on: {
        type: "string",
        description: "ISO 8601 date string or null",
      },
      completed_on_before: {
        type: "string",
        description: "ISO 8601 date string",
      },
      completed_on_after: {
        type: "string",
        description: "ISO 8601 date string",
      },
      completed_at_before: {
        type: "string",
        description: "ISO 8601 datetime string",
      },
      completed_at_after: {
        type: "string",
        description: "ISO 8601 datetime string",
      },
      modified_on: {
        type: "string",
        description: "ISO 8601 date string or null",
      },
      modified_on_before: {
        type: "string",
        description: "ISO 8601 date string",
      },
      modified_on_after: {
        type: "string",
        description: "ISO 8601 date string",
      },
      modified_at_before: {
        type: "string",
        description: "ISO 8601 datetime string",
      },
      modified_at_after: {
        type: "string",
        description: "ISO 8601 datetime string",
      },
      completed: {
        type: "boolean",
        description: "Filter for completed tasks",
      },
      is_subtask: {
        type: "boolean",
        description: "Filter for subtasks",
      },
      has_attachment: {
        type: "boolean",
        description: "Filter for tasks with attachments",
      },
      is_blocked: {
        type: "boolean",
        description: "Filter for tasks with incomplete dependencies",
      },
      is_blocking: {
        type: "boolean",
        description: "Filter for incomplete tasks with dependents",
      },
      sort_by: {
        type: "string",
        description:
          "Sort by: due_date, created_at, completed_at, likes, modified_at",
        default: "modified_at",
      },
      sort_ascending: {
        type: "boolean",
        description: "Sort in ascending order",
        default: false,
      },
      opt_fields: {
        type: "string",
        description: "Comma-separated list of optional fields to include",
      },
      custom_fields: {
        type: "object",
        description: `Object containing custom field filters. Keys should be in the format "{gid}.{operation}" where operation can be:
- {gid}.is_set: Boolean - For all custom field types, check if value is set
- {gid}.value: String|Number|String(enum_option_gid) - Direct value match for Text, Number or Enum fields
- {gid}.starts_with: String - For Text fields only, check if value starts with string
- {gid}.ends_with: String - For Text fields only, check if value ends with string
- {gid}.contains: String - For Text fields only, check if value contains string
- {gid}.less_than: Number - For Number fields only, check if value is less than number
- {gid}.greater_than: Number - For Number fields only, check if value is greater than number

Example: { "12345.value": "high", "67890.contains": "urgent" }`,
      },
    },
    required: ["workspace"],
  },
};

export const getTaskTool: Tool = {
  name: "asana_get_task",
  description: "Get detailed information about a specific task",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The task ID to retrieve",
      },
      opt_fields: {
        type: "string",
        description: "Comma-separated list of optional fields to include",
      },
    },
    required: ["task_id"],
  },
};

export const createTaskTool: Tool = {
  name: "asana_create_task",
  description: "Create a new task in a project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "The project to create the task in",
      },
      name: {
        type: "string",
        description: "Name of the task",
      },
      notes: {
        type: "string",
        description: "Description of the task",
      },
      html_notes: {
        type: "string",
        description:
          'HTML-like formatted description of the task. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
      },
      due_on: {
        type: "string",
        description: "Due date in YYYY-MM-DD format",
      },
      assignee: {
        type: "string",
        description: "Assignee (can be 'me' or a user ID)",
      },
      followers: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Array of user IDs to add as followers",
      },
      parent: {
        type: "string",
        description: "The parent task ID to set this task under",
      },
      projects: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Array of project IDs to add this task to",
      },
      resource_subtype: {
        type: "string",
        description:
          "The type of the task. Can be one of 'default_task' or 'milestone'",
      },
      custom_fields: {
        type: "object",
        description:
          "Object mapping custom field GID strings to their values. For enum fields use the enum option GID as the value.",
      },
      section: {
        type: "string",
        description: "Optional: Section GID to create the task in. If provided, task will be created directly in this section instead of the default section.",
      },
    },
    required: ["project_id", "name"],
  },
};

export const updateTaskTool: Tool = {
  name: "asana_update_task",
  description: "Update an existing task's details",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The task ID to update",
      },
      name: {
        type: "string",
        description: "New name for the task",
      },
      notes: {
        type: "string",
        description: "New description for the task",
      },
      due_on: {
        type: "string",
        description: "New due date in YYYY-MM-DD format",
      },
      assignee: {
        type: "string",
        description: "New assignee (can be 'me' or a user ID)",
      },
      completed: {
        type: "boolean",
        description: "Mark task as completed or not",
      },
      resource_subtype: {
        type: "string",
        description:
          "The type of the task. Can be one of 'default_task' or 'milestone'",
      },
      custom_fields: {
        type: "object",
        description:
          "Object mapping custom field GID strings to their values. For enum fields use the enum option GID as the value.",
      },
    },
    required: ["task_id"],
  },
};

export const createSubtaskTool: Tool = {
  name: "asana_create_subtask",
  description: "Create a new subtask for an existing task",
  inputSchema: {
    type: "object",
    properties: {
      parent_task_id: {
        type: "string",
        description: "The parent task ID to create the subtask under",
      },
      name: {
        type: "string",
        description: "Name of the subtask",
      },
      notes: {
        type: "string",
        description: "Description of the subtask",
      },
      html_notes: {
        type: "string",
        description:
          'HTML-like formatted description of the subtask. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
      },
      due_on: {
        type: "string",
        description: "Due date in YYYY-MM-DD format",
      },
      assignee: {
        type: "string",
        description: "Assignee (can be 'me' or a user ID)",
      },
      opt_fields: {
        type: "string",
        description: "Comma-separated list of optional fields to include",
      },
    },
    required: ["parent_task_id", "name"],
  },
};

export const getMultipleTasksByGidTool: Tool = {
  name: "asana_get_multiple_tasks_by_gid",
  description:
    "Get detailed information about multiple tasks by their GIDs (maximum 25 tasks)",
  inputSchema: {
    type: "object",
    properties: {
      task_ids: {
        oneOf: [
          {
            type: "array",
            items: {
              type: "string",
            },
            maxItems: 25,
          },
          {
            type: "string",
            description: "Comma-separated list of task GIDs (max 25)",
          },
        ],
        description:
          "Array or comma-separated string of task GIDs to retrieve (max 25)",
      },
      opt_fields: {
        type: "string",
        description: "Comma-separated list of optional fields to include",
      },
    },
    required: ["task_ids"],
  },
};

export const addProjectToTaskTool: Tool = {
  name: "asana_add_project_to_task",
  description:
    "Add an existing task to a project. If no positioning arguments are given, the task will be added to the end of the project.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The task ID to add to the project",
      },
      project_id: {
        type: "string",
        description: "The project ID to add the task to",
      },
      section: {
        type: "string",
        description:
          "Optional: The section ID to add the task to within the project",
      },
      insert_after: {
        type: "string",
        description:
          "Optional: A task ID to insert this task after. At most one of insert_before, insert_after, or section should be specified.",
      },
      insert_before: {
        type: "string",
        description:
          "Optional: A task ID to insert this task before. At most one of insert_before, insert_after, or section should be specified.",
      },
    },
    required: ["task_id", "project_id"],
  },
};

export const removeProjectFromTaskTool: Tool = {
  name: "asana_remove_project_from_task",
  description:
    "Remove a task from a project. The task will still exist in the system, but it will not be in the project anymore.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The task ID to remove from the project",
      },
      project_id: {
        type: "string",
        description: "The project ID to remove the task from",
      },
    },
    required: ["task_id", "project_id"],
  },
};

export const deleteTaskTool: Tool = {
  name: "asana_delete_task",
  description:
    "Delete a task. This permanently removes the task and cannot be undone.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The task ID to delete",
      },
    },
    required: ["task_id"],
  },
};

export const batchCreateTasksTool: Tool = {
  name: "asana_batch_create_tasks",
  description:
    "Create multiple tasks in batch within the same project. Maximum 150 tasks per batch (10 recommended for optimal performance).",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "The project to create tasks in",
      },
      tasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the task",
            },
            notes: {
              type: "string",
              description: "Description of the task",
            },
            html_notes: {
              type: "string",
              description:
                'HTML-like formatted description of the task. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
            },
            due_on: {
              type: "string",
              description: "Due date in YYYY-MM-DD format",
            },
            assignee: {
              type: "string",
              description: "Assignee (can be 'me' or a user ID)",
            },
            followers: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of user IDs to add as followers",
            },
            resource_subtype: {
              type: "string",
              description:
                "The type of the task. Can be one of 'default_task' or 'milestone'",
              enum: ["default_task", "milestone"],
            },
            custom_fields: {
              type: "object",
              description:
                "Object mapping custom field GID strings to their values. For enum fields use the enum option GID as the value.",
            },
            section: {
              type: "string",
              description: "Optional: Section GID to create the task in. If provided, task will be created directly in this section instead of the default section.",
            },
          },
          required: ["name"],
        },
        maxItems: 150,
        description: "Array of task objects to create (max 150)",
      },
      continue_on_error: {
        type: "boolean",
        default: false,
        description: "Continue processing if individual task creation fails",
      },
    },
    required: ["project_id", "tasks"],
  },
};

export const batchUpdateTasksTool: Tool = {
  name: "asana_batch_update_tasks",
  description:
    "Update multiple existing tasks in batch. Maximum 150 tasks per batch (10 recommended for optimal performance).",
  inputSchema: {
    type: "object",
    properties: {
      task_updates: {
        type: "array",
        items: {
          type: "object",
          properties: {
            task_id: {
              type: "string",
              description: "The task ID to update",
            },
            name: {
              type: "string",
              description: "New name for the task",
            },
            notes: {
              type: "string",
              description: "New description for the task",
            },
            html_notes: {
              type: "string",
              description:
                'HTML-like formatted description of the task. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
            },
            due_on: {
              type: "string",
              description: "New due date in YYYY-MM-DD format",
            },
            assignee: {
              type: "string",
              description: "New assignee (can be 'me' or a user ID)",
            },
            completed: {
              type: "boolean",
              description: "Mark task as completed or not",
            },
            resource_subtype: {
              type: "string",
              description:
                "The type of the task. Can be one of 'default_task' or 'milestone'",
              enum: ["default_task", "milestone"],
            },
            custom_fields: {
              type: "object",
              description:
                "Object mapping custom field GID strings to their values. For enum fields use the enum option GID as the value.",
            },
          },
          required: ["task_id"],
        },
        maxItems: 150,
        description: "Array of task update objects (max 150)",
      },
      continue_on_error: {
        type: "boolean",
        default: false,
        description: "Continue processing if individual task update fails",
      },
    },
    required: ["task_updates"],
  },
};

export const batchCreateSubtasksTool: Tool = {
  name: "asana_batch_create_subtasks",
  description:
    "Create multiple subtasks for existing parent tasks in batch. Maximum 150 subtasks per batch (10 recommended for optimal performance).",
  inputSchema: {
    type: "object",
    properties: {
      subtasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            parent_task_id: {
              type: "string",
              description: "The parent task ID to create the subtask under",
            },
            name: {
              type: "string",
              description: "Name of the subtask",
            },
            notes: {
              type: "string",
              description: "Description of the subtask",
            },
            html_notes: {
              type: "string",
              description:
                'HTML-like formatted description of the subtask. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
            },
            due_on: {
              type: "string",
              description: "Due date in YYYY-MM-DD format",
            },
            assignee: {
              type: "string",
              description: "Assignee (can be 'me' or a user ID)",
            },
          },
          required: ["parent_task_id", "name"],
        },
        maxItems: 150,
        description: "Array of subtask objects to create (max 150)",
      },
      continue_on_error: {
        type: "boolean",
        default: false,
        description: "Continue processing if individual subtask creation fails",
      },
    },
    required: ["subtasks"],
  },
};

export const batchDeleteTasksTool: Tool = {
  name: "asana_batch_delete_tasks",
  description:
    "Delete multiple tasks in batch. Maximum 150 tasks per batch (10 recommended for optimal performance). This permanently removes the tasks and cannot be undone.",
  inputSchema: {
    type: "object",
    properties: {
      task_ids: {
        type: "array",
        items: {
          type: "string",
        },
        maxItems: 150,
        description: "Array of task IDs to delete (max 150)",
      },
      continue_on_error: {
        type: "boolean",
        default: false,
        description: "Continue processing if individual task deletion fails",
      },
    },
    required: ["task_ids"],
  },
};

export const createTaskWithSubtasksTool: Tool = {
  name: "asana_create_task_with_subtasks",
  description:
    "Create any type of task (regular, milestone, section, approval) with optional subtasks in a single operation. Maximum 50 subtasks per operation.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "Project to create the task in",
      },
      name: {
        type: "string",
        description: "Task name",
      },
      notes: {
        type: "string",
        description: "Task description",
      },
      html_notes: {
        type: "string",
        description:
          'HTML-like formatted description. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
      },
      due_on: {
        type: "string",
        description: "Due date in YYYY-MM-DD format",
      },
      assignee: {
        type: "string",
        description: "Assignee (can be 'me' or a user ID)",
      },
      followers: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Array of user IDs to add as followers",
      },
      resource_subtype: {
        type: "string",
        description:
          "The type of the task. Can be one of 'default_task', 'milestone', or 'approval'",
        enum: ["default_task", "milestone", "approval"],
      },
      custom_fields: {
        type: "object",
        description:
          "Object mapping custom field GID strings to their values. For enum fields use the enum option GID as the value.",
      },
      section: {
        type: "string",
        description: "Optional: Section GID to create the task in. If provided, task will be created directly in this section instead of the default section.",
      },
      subtasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Subtask name",
            },
            notes: {
              type: "string",
              description: "Subtask description",
            },
            html_notes: {
              type: "string",
              description:
                'HTML-like formatted subtask description. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
            },
            due_on: {
              type: "string",
              description: "Subtask due date in YYYY-MM-DD format",
            },
            assignee: {
              type: "string",
              description: "Subtask assignee (can be 'me' or a user ID)",
            },
            followers: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of user IDs to add as subtask followers",
            },
            custom_fields: {
              type: "object",
              description:
                "Object mapping custom field GID strings to their values for the subtask. For enum fields use the enum option GID as the value.",
            },
          },
          required: ["name"],
        },
        maxItems: 50,
        description:
          "Optional array of subtasks to create under the main task (max 50)",
      },
      continue_on_error: {
        type: "boolean",
        default: false,
        description:
          "Continue creating subtasks if main task creation fails (only applies when subtasks are provided)",
      },
    },
    required: ["project_id", "name"],
  },
};

export const batchCreateTasksWithSubtasksTool: Tool = {
  name: "asana_batch_create_tasks_with_subtasks",
  description:
    "Create multiple tasks with optional subtasks in batch within the same project. Each task can have its own set of subtasks. Maximum 50 tasks per batch (10 recommended for optimal performance). Supports direct section assignment.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "The project to create tasks in",
      },
      tasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the task",
            },
            notes: {
              type: "string",
              description: "Description of the task",
            },
            html_notes: {
              type: "string",
              description:
                'HTML-like formatted description of the task. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
            },
            due_on: {
              type: "string",
              description: "Due date in YYYY-MM-DD format",
            },
            assignee: {
              type: "string",
              description: "Assignee (can be 'me' or a user ID)",
            },
            followers: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of user IDs to add as followers",
            },
            resource_subtype: {
              type: "string",
              description:
                "The type of the task. Can be one of 'default_task', 'milestone', or 'approval'",
              enum: ["default_task", "milestone", "approval"],
            },
            custom_fields: {
              type: "object",
              description:
                "Object mapping custom field GID strings to their values. For enum fields use the enum option GID as the value.",
            },
            section: {
              type: "string",
              description: "Optional: Section GID to create the task in. If provided, task will be created directly in this section instead of the default section.",
            },
            subtasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Subtask name",
                  },
                  notes: {
                    type: "string",
                    description: "Subtask description",
                  },
                  html_notes: {
                    type: "string",
                    description:
                      'HTML-like formatted subtask description. Does not support ALL HTML tags. Only a subset. The only allowed TAG in the HTML are: <body> <h1> <h2> <ol> <ul> <li> <strong> <em> <u> <s> <code> <pre> <blockquote> <a data-asana-type="" data-asana-gid=""> <hr> <img> <table> <tr> <td>. No other tags are allowed. Use the \\n to create a newline. Do not use \\n after <body>. Example: <body><h1>Motivation</h1>\nA customer called in to complain\n<h1>Goal</h1>\nFix the problem</body>',
                  },
                  due_on: {
                    type: "string",
                    description: "Subtask due date in YYYY-MM-DD format",
                  },
                  assignee: {
                    type: "string",
                    description: "Subtask assignee (can be 'me' or a user ID)",
                  },
                  followers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Array of user IDs to add as subtask followers",
                  },
                  custom_fields: {
                    type: "object",
                    description:
                      "Object mapping custom field GID strings to their values for the subtask. For enum fields use the enum option GID as the value.",
                  },
                },
                required: ["name"],
              },
              maxItems: 50,
              description: "Optional array of subtasks to create under this task (max 50 subtasks per task)",
            },
          },
          required: ["name"],
        },
        maxItems: 50,
        description: "Array of task objects to create (max 50). Each task can optionally have subtasks.",
      },
      continue_on_error: {
        type: "boolean",
        default: false,
        description: "Continue processing if individual task creation fails",
      },
    },
    required: ["project_id", "tasks"],
  },
};
